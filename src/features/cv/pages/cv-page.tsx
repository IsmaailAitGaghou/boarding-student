import { useEffect, useState } from "react";
import {
   Box,
   Typography,
   Card,
   CardContent,
   Alert,
   Snackbar,
   LinearProgress,
   alpha,
} from "@mui/material";
import { getCv, uploadCv, deleteCv, downloadCv } from "../api";
import { CvEmptyState, CvUploadZone, CvFileCard } from "../components";
import { Loading } from "@/shared/components/loading";
import type { CvFile } from "../types";
import { tokens } from "@/app/theme";

export function CvPage() {
   const [cv, setCv] = useState<CvFile | null>(null);
   const [loading, setLoading] = useState(true);
   const [uploading, setUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [downloading, setDownloading] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState("");

   useEffect(() => {
      loadCv();
   }, []);

   const loadCv = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await getCv();
         setCv(data);
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to load CV. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   const handleFileSelect = async (file: File) => {
      try {
         setUploading(true);
         setUploadProgress(0);
         setError(null);

         const uploadedCv = await uploadCv(file, (progress) => {
            setUploadProgress(progress);
         });

         setCv(uploadedCv);
         setSuccessMessage(
            cv ? "CV replaced successfully!" : "CV uploaded successfully!",
         );
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to upload CV. Please try again.",
         );
      } finally {
         setUploading(false);
         setUploadProgress(0);
      }
   };

   const handleDownload = async () => {
      if (!cv) return;

      try {
         setDownloading(true);
         setError(null);
         await downloadCv(cv.fileName);
         setSuccessMessage("CV downloaded successfully!");
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to download CV. Please try again.",
         );
      } finally {
         setDownloading(false);
      }
   };

   const handleDelete = async () => {
      try {
         setDeleting(true);
         setError(null);
         await deleteCv();
         setCv(null);
         setSuccessMessage("CV deleted successfully!");
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to delete CV. Please try again.",
         );
      } finally {
         setDeleting(false);
      }
   };

   const handleReplace = () => {
      // Trigger file selection for replacement
      // The upload zone will handle the file selection
   };

   if (loading) {
      return <Loading variant="section" minHeight={400} />;
   }

   return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
         {/* Header */}
         <Box sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
               CV Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
               Upload, manage, and share your curriculum vitae with potential
               employers
            </Typography>
         </Box>

         {error && (
            <Alert
               severity="error"
               sx={{ mb: 3 }}
               onClose={() => setError(null)}
            >
               {error}
            </Alert>
         )}

         {/* Main Card */}
         <Card
            sx={{
               borderRadius: 2,
               border: `1px solid ${tokens.color.border}`,
               boxShadow: "none",
            }}
         >
            <CardContent sx={{ p: 4 }}>
               {/* Upload Progress Bar */}
               {uploading && (
                  <Box sx={{ mb: 3 }}>
                     <Box
                        sx={{
                           display: "flex",
                           justifyContent: "space-between",
                           alignItems: "center",
                           mb: 1,
                        }}
                     >
                        <Typography
                           variant="body2"
                           sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                           Uploading CV...
                        </Typography>
                        <Typography
                           variant="body2"
                           sx={{
                              fontWeight: 600,
                              color: tokens.color.primary[700],
                           }}
                        >
                           {uploadProgress}%
                        </Typography>
                     </Box>
                     <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                           height: 8,
                           borderRadius: 1,
                           backgroundColor: alpha(
                              tokens.color.primary[700],
                              0.1,
                           ),
                           "& .MuiLinearProgress-bar": {
                              borderRadius: 1,
                              backgroundColor: tokens.color.primary[700],
                           },
                        }}
                     />
                  </Box>
               )}

               {/* CV Status */}
               {cv ? (
                  <Box>
                     <CvFileCard
                        cv={cv}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        onReplace={handleReplace}
                        downloading={downloading}
                        deleting={deleting}
                     />

                     {/* Replace CV Option */}
                     {!uploading && (
                        <Box sx={{ mt: 3 }}>
                           <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 2 }}
                           >
                              Replace CV
                           </Typography>
                           <CvUploadZone
                              onFileSelect={handleFileSelect}
                              disabled={uploading || downloading || deleting}
                           />
                        </Box>
                     )}
                  </Box>
               ) : (
                  <>
                     {/* Empty State */}
                     <CvEmptyState />

                     {/* Upload Zone */}
                     <Box sx={{ mt: 3 }}>
                        <CvUploadZone
                           onFileSelect={handleFileSelect}
                           disabled={uploading}
                        />
                     </Box>
                  </>
               )}
            </CardContent>
         </Card>

         {/* Success Snackbar */}
         <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
         >
            <Alert
               onClose={() => setSuccessMessage("")}
               severity="success"
               sx={{ width: "100%" }}
            >
               {successMessage}
            </Alert>
         </Snackbar>
      </Box>
   );
}
