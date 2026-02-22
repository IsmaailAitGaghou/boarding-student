import { useState, useRef } from "react";
import type { DragEvent } from "react";
import { Box, Button, Typography, alpha } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { tokens } from "@/app/theme";
import {
   ALLOWED_FILE_EXTENSIONS,
   MAX_FILE_SIZE,
   formatFileSize,
   isValidFileType,
   isValidFileSize,
} from "../api";

interface CvUploadZoneProps {
   onFileSelect: (file: File) => void;
   disabled?: boolean;
}

export function CvUploadZone({ onFileSelect, disabled }: CvUploadZoneProps) {
   const [isDragging, setIsDragging] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const validateAndSelectFile = (file: File) => {
      setError(null);

      // Validate file type
      if (!isValidFileType(file)) {
         setError(
            `Invalid file type. Please upload ${ALLOWED_FILE_EXTENSIONS.join(
               ", ",
            )} files only.`,
         );
         return;
      }

      // Validate file size
      if (!isValidFileSize(file)) {
         setError(
            `File size exceeds ${formatFileSize(
               MAX_FILE_SIZE,
            )}. Please upload a smaller file.`,
         );
         return;
      }

      onFileSelect(file);
   };

   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
         setIsDragging(true);
      }
   };

   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
   };

   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
         validateAndSelectFile(files[0]);
      }
   };

   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
         validateAndSelectFile(files[0]);
      }
    //   Reset input so same file can be selected again
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const handleBrowseClick = () => {
      fileInputRef.current?.click();
   };

   return (
      <Box>
         <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
               border: `2px dashed ${
                  isDragging ? tokens.color.primary[700] : tokens.color.border
               }`,
               borderRadius: 2,
               p: 6,
               textAlign: "center",
               backgroundColor: isDragging
                  ? alpha(tokens.color.primary[700], 0.04)
                  : "transparent",
               transition: "all 0.2s ease",
               cursor: disabled ? "not-allowed" : "pointer",
               opacity: disabled ? 0.5 : 1,
               "&:hover": disabled
                  ? {}
                  : {
                       borderColor: tokens.color.primary[700],
                       backgroundColor: alpha(tokens.color.primary[700], 0.02),
                    },
            }}
            onClick={disabled ? undefined : handleBrowseClick}
         >
            <CloudUploadOutlinedIcon
               sx={{
                  fontSize: 48,
                  color: isDragging
                     ? tokens.color.primary[700]
                     : "text.secondary",
                  mb: 2,
               }}
            />
            <Typography
               variant="body1"
               sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
            >
               {isDragging ? "Drop your file here" : "Drag & drop your CV here"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
               or
            </Typography>
            <Button
               variant="outlined"
               disabled={disabled}
               onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
               }}
            >
               Browse Files
            </Button>
            <Typography
               variant="caption"
               color="text.secondary"
               sx={{ display: "block", mt: 3 }}
            >
               Supported formats:{" "}
               {ALLOWED_FILE_EXTENSIONS.join(", ").toUpperCase()} • Max size:{" "}
               {formatFileSize(MAX_FILE_SIZE)}
            </Typography>
         </Box>

         {error && (
            <Typography
               variant="body2"
               color="error"
               sx={{ mt: 1.5, textAlign: "center" }}
            >
               {error}
            </Typography>
         )}

         <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FILE_EXTENSIONS.join(",")}
            onChange={handleFileInputChange}
            style={{ display: "none" }}
         />
      </Box>
   );
}
