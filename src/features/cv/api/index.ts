import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { mockDelay } from "@/api/mock-helpers";
import { formatFileSize, formatDate } from "@/shared/utils/formatters";

export { formatFileSize };
export const formatUploadDate = formatDate;
import type { CvFile } from "../types";

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
   await mockDelay(400);
   return mockCvData;
};

const mockUploadCv = async (
   file: File,
   onProgress?: (progress: number) => void
): Promise<CvFile> => {
   // Simulate upload progress
   const chunks = 20;
   for (let i = 0; i <= chunks; i++) {
      await mockDelay(50); // 50ms per chunk = 1 second total
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
   await mockDelay(300);
   if (mockCvData?.fileUrl) {
      URL.revokeObjectURL(mockCvData.fileUrl); // Clean up blob URL
   }
   mockCvData = null;
};

const mockDownloadCv = async (): Promise<Blob> => {
   await mockDelay(200);
   if (!mockCvData) {
      throw new Error("No CV found");
   }

   // For mock, return a simple blob
   const blob = new Blob(["Mock CV content"], { type: mockCvData.mimeType });
   return blob;
};




export async function getCv(): Promise<CvFile | null> {
	if (isMock()) return mockGetCv();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	return api.request<CvFile | null>(endpoints.cv.get, { method: "GET" });
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

	// Real API: multipart/form-data upload with XHR for progress tracking
	return new Promise<CvFile>((resolve, reject) => {
		const formData = new FormData();
		formData.append("file", file);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", `${getApiBaseUrl()}${endpoints.cv.upload}`);

		const token = localStorage.getItem("token");
		if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

		xhr.upload.addEventListener("progress", (e) => {
			if (e.lengthComputable) {
				onProgress?.(Math.round((e.loaded / e.total) * 100));
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					resolve(JSON.parse(xhr.responseText) as CvFile);
				} catch {
					reject(new Error("Invalid response from server"));
				}
			} else {
				reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
			}
		});

		xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
		xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
		xhr.send(formData);
	});
}


export async function deleteCv(): Promise<void> {
	if (isMock()) return mockDeleteCv();
	const api = createApiClient({ baseUrl: getApiBaseUrl() });
	await api.request<void>(endpoints.cv.delete, { method: "DELETE" });
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
	// Real API: stream the file download
	const token = localStorage.getItem("token");
	const res = await fetch(`${getApiBaseUrl()}${endpoints.cv.download}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	if (!res.ok) throw new Error(`Download failed: ${res.status}`);
	const blob = await res.blob();
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}// ============================================================================
// Validation Helpers
// ============================================================================

export function isValidFileType(file: File): boolean {
   return ALLOWED_FILE_TYPES.includes(file.type);
}


export function isValidFileSize(file: File): boolean {
   return file.size <= MAX_FILE_SIZE;
}

