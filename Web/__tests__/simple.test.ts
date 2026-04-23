import assert from 'assert';
import { cn, generateRoomId, formatBytes, calculateProgress } from '../src/lib/utils';

console.log("Running real-world unit tests for MangoShare utility logic...");

try {
  // --- 1. Testing Classname Utility ---
  // Significance: UI depends entirely on this correctly processing states to hide/show/style active transfers.
  const isActive = true;
  assert.strictEqual(cn("p-4", isActive && "bg-blue-500", "p-3"), "bg-blue-500 p-3", "cn utility failed tailwind override");

  // --- 2. Testing Secure Room Generation ---
  // Significance: Core P2P sharing feature. Needs exactly 6 numeric digits allowing easy typing by receiver.
  const id1 = generateRoomId();
  const id2 = generateRoomId();
  assert.strictEqual(id1.length, 6, `Room ID should be exactly 6 characters long (got ${id1.length})`);
  assert.match(id1, /^[0-9]{6}$/, "Room ID must contain exactly 6 numeric digits");
  assert.notStrictEqual(id1, id2, "Room IDs should be statistically unique per run");

  // --- 3. Testing File Formatting Logic ---
  // Significance: Files transferred over HTTP/Websockets arrive in bytes. The UI must cleanly parse this for users.
  assert.strictEqual(formatBytes(0), "0 Bytes", "Failed mapping empty size to 0 bytes");
  assert.strictEqual(formatBytes(1024), "1 KB", "Failed strictly mapping 1024 as 1 KB");
  assert.strictEqual(formatBytes(1234567, 2), "1.18 MB", "Failed format layout and fallback decimal rounding logic");
  assert.strictEqual(formatBytes(15 * 1024 * 1024 * 1024), "15 GB", "Failed calculating extremely large sizes (GB)");

  // --- 4. Testing Progress Calculation ---
  // Significance: Displays progress-bar width on chunk arrivals. Erroneous rounding breaks UI animation completely.
  assert.strictEqual(calculateProgress(0, 100), 0, "Transfer should compute 0% when no chunks sent");
  assert.strictEqual(calculateProgress(50, 100), 50, "Failed calculating dead center percentage properly (50%)");
  assert.strictEqual(calculateProgress(100, 100), 100, "Progress shouldn't exceed or stall beneath 100% on finish");
  assert.strictEqual(calculateProgress(105, 100), 100, "Safeguard logic failure: should return max 100% even if over chunk bounds");
  assert.strictEqual(calculateProgress(1, 0), 0, "Zero boundary issue – transferring empty file should not evaluate Infinity");
  assert.strictEqual(calculateProgress(12345, 98765), 13, "Complex division offsets should round correctly to integers");

  console.log("All real-world domain tests passed successfully! ✅");
} catch (error) {
  console.error("❌ Test failed:");
  console.error(error);
  process.exit(1); 
}
