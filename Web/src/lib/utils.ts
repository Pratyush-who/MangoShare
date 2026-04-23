import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random 6-digit room ID for secure file sharing.
 */
export function generateRoomId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Formats a file size in bytes to a human-readable string (KB, MB, GB, etc.)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculates the upload/download percentage based on offset and total size.
 */
export function calculateProgress(offset: number, totalSize: number): number {
  if (totalSize === 0) return 0;
  if (offset >= totalSize) return 100;
  return Math.round((offset / totalSize) * 100);
}

