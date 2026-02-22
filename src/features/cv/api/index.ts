import { isMock } from "@/api/env";
import type { CvFile } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Validation constants
export const ALLOWED_FILE_TYPES = [
   "application/pdf",
   "application/msword",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Mock CV data
let mockCvData: CvFile | null = null;

const mockGetCv = async (): Promise<CvFile | null> => {
   await sleep(400);
   return mockCvData;
};

const mockUploadCv = async (
   file: File,
   onProgress?: (progress: number) => void
): Promise<CvFile> => {
   // Simulate upload progress
   const chunks = 20;
   for (let i = 0; i <= chunks; i++) {
      await sleep(50); // 50ms per chunk = 1 second total
      const progress = Math.round((i / chunks) * 100);
      onProgress?.(progress);
   }

   // Create mock CV file
   mockCvData = {
      id: `cv-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      fileUrl: URL.createObjectURL(file), // Create blob URL for mock download
      mimeType: file.type,
   };

   return mockCvData;
};

const mockDeleteCv = async (): Promise<void> => {
   await sleep(300);
   if (mockCvData?.fileUrl) {
      URL.revokeObjectURL(mockCvData.fileUrl); // Clean up blob URL
   }
   mockCvData = null;
};

const mockDownloadCv = async (): Promise<Blob> => {
   await sleep(200);
   if (!mockCvData) {
      throw new Error("No CV found");
   }

   // For mock, return a simple blob
   const blob = new Blob(["Mock CV content"], { type: mockCvData.mimeType });
   return blob;
};




export async function getCv(): Promise<CvFile | null> {
   if (isMock()) return mockGetCv();
   // TODO: Real API call
   throw new Error("Real API not implemented");
}

/**
 * @param file - The CV file to upload
 * @param onProgress - Optional callback for upload progress (0-100)
 */
export async function uploadCv(
   file: File,
   onProgress?: (progress: number) => void
): Promise<CvFile> {
   // Validate file type
   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(
         "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
      );
   }

   
   if (file.size > MAX_FILE_SIZE) {
      throw new Error(
         `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`
      );
   }

   if (isMock()) return mockUploadCv(file, onProgress);
   // TODO: Real API call with XMLHttpRequest or fetch for progress tracking
   throw new Error("Real API not implemented");
}


export async function deleteCv(): Promise<void> {
   if (isMock()) return mockDeleteCv();
   // TODO: Real API call
   throw new Error("Real API not implemented");
}


export async function downloadCv(fileName: string): Promise<void> {
   if (isMock()) {
      const blob = await mockDownloadCv();
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
   }
   // TODO: Real API call
   throw new Error("Real API not implemented");
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function isValidFileType(file: File): boolean {
   return ALLOWED_FILE_TYPES.includes(file.type);
}


export function isValidFileSize(file: File): boolean {
   return file.size <= MAX_FILE_SIZE;
}


export function formatFileSize(bytes: number): string {
   if (bytes === 0) return "0 Bytes";
   const k = 1024;
   const sizes = ["Bytes", "KB", "MB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function formatUploadDate(isoDate: string): string {
   const date = new Date(isoDate);
   return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });
}
