export interface CvFile {
   id: string;
   fileName: string;
   fileSize: number;
   uploadedAt: string;
   fileUrl?: string; // for download
   mimeType: string;
}

export interface CvUploadRequest {
   file: File;
}

export interface CvUploadProgress {
   loaded: number;
   total: number;
   percentage: number;
}
