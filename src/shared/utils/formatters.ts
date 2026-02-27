/**
 * Shared formatting utilities used across features.
 */

/**
 * Format a byte count into a human-readable file size string.
 * e.g. 1024 → "1 KB"
 */
export function formatFileSize(bytes: number): string {
   if (bytes === 0) return "0 Bytes";
   const k = 1024;
   const sizes = ["Bytes", "KB", "MB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format an ISO date string into a long English date.
 * e.g. "2024-03-15T00:00:00Z" → "March 15, 2024"
 */
export function formatDate(isoDate: string): string {
   const date = new Date(isoDate);
   return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });
}
