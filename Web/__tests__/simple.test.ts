// A simple test without any external library

console.log("Running a simple test...");

// Test case 1: Check if true is true
console.assert(true === true, "Test Case 1 Failed: true should be true");

// Test case 2: A simple arithmetic test
const sum = (a: number, b: number) => a + b;
console.assert(sum(2, 3) === 5, "Test Case 2 Failed: sum(2, 3) should be 5");

console.log("Simple test finished.");
