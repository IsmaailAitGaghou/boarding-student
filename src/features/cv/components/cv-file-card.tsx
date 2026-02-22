import { useState } from "react";
import {
   Box,
   Typography,
   IconButton,
   Stack,
   Chip,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   alpha,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { tokens } from "@/app/theme";
import { formatFileSize, formatUploadDate } from "../api";
import type { CvFile } from "../types";

interface CvFileCardProps {
   cv: CvFile;
   onDownload: () => void;
   onDelete: () => void;
   onReplace: () => void;
   downloading?: boolean;
   deleting?: boolean;
}

export function CvFileCard({
   cv,
   onDownload,
   onDelete,
   onReplace,
   downloading,
   deleting,
}: CvFileCardProps) {
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

   const handleDeleteClick = () => {
      setDeleteDialogOpen(true);
   };

   const handleDeleteConfirm = () => {
      setDeleteDialogOpen(false);
      onDelete();
   };

   const handleDeleteCancel = () => {
      setDeleteDialogOpen(false);
   };

   const fileExtension = cv.fileName.split(".").pop()?.toUpperCase() || "";

   return (
      <>
         <Box
            sx={{
               border: `1px solid ${tokens.color.border}`,
               borderRadius: 2,
               p: 3,
               backgroundColor: "background.paper",
            }}
         >
            <Stack direction="row" spacing={2} alignItems="flex-start">
               {/* File Icon */}
               <Box
                  sx={{
                     width: 56,
                     height: 56,
                     borderRadius: 1.5,
                     backgroundColor: alpha(tokens.color.primary[700], 0.08),
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     flexShrink: 0,
                  }}
               >
                  <DescriptionOutlinedIcon
                     sx={{ fontSize: 32, color: tokens.color.primary[700] }}
                  />
               </Box>

               {/* File Info */}
               <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                     variant="body1"
                     sx={{ fontWeight: 600, mb: 0.5, wordBreak: "break-word" }}
                  >
                     {cv.fileName}
                  </Typography>
                  <Stack
                     direction="row"
                     spacing={1}
                     alignItems="center"
                     flexWrap="wrap"
                     sx={{ mb: 1 }}
                  >
                     <Chip
                        label={fileExtension}
                        size="small"
                        sx={{
                           height: 20,
                           fontSize: "0.6875rem",
                           fontWeight: 600,
                           backgroundColor: alpha(
                              tokens.color.primary[700],
                              0.08,
                           ),
                           color: tokens.color.primary[700],
                        }}
                     />
                     <Typography variant="caption" color="text.secondary">
                        {formatFileSize(cv.fileSize)}
                     </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                     Uploaded on {formatUploadDate(cv.uploadedAt)}
                  </Typography>
               </Box>

               {/* Actions */}
               <Stack direction="row" spacing={0.5}>
                  <IconButton
                     size="small"
                     onClick={onDownload}
                     disabled={downloading || deleting}
                     title="Download CV"
                     sx={{
                        color: "text.secondary",
                        "&:hover": {
                           backgroundColor: alpha(
                              tokens.color.text.secondary,
                              0.08,
                           ),
                        },
                     }}
                  >
                     <DownloadOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                     size="small"
                     onClick={onReplace}
                     disabled={downloading || deleting}
                     title="Replace CV"
                     sx={{
                        color: "text.secondary",
                        "&:hover": {
                           backgroundColor: alpha(
                              tokens.color.text.secondary,
                              0.08,
                           ),
                        },
                     }}
                  >
                     <CloudUploadOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                     size="small"
                     onClick={handleDeleteClick}
                     disabled={downloading || deleting}
                     title="Delete CV"
                     sx={{
                        color: "error.main",
                        "&:hover": {
                           backgroundColor: alpha(tokens.color.error, 0.08),
                        },
                     }}
                  >
                     <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
               </Stack>
            </Stack>
         </Box>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
               sx: {
                  borderRadius: 2,
               },
            }}
         >
            <DialogTitle sx={{ fontWeight: 600 }}>Delete CV?</DialogTitle>
            <DialogContent>
               <Typography variant="body2" color="text.secondary">
                  Are you sure you want to delete "{cv.fileName}"? This action
                  cannot be undone.
               </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
               <Button onClick={handleDeleteCancel} color="inherit">
                  Cancel
               </Button>
               <Button
                  onClick={handleDeleteConfirm}
                  color="error"
                  variant="contained"
               >
                  Delete
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
}
