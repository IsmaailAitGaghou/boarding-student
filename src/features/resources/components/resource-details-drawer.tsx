import {
   Drawer,
   Box,
   IconButton,
   Typography,
   Chip,
   Button,
   CircularProgress,
   Divider,
   alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { tokens } from "@/app/theme";
import type { Resource } from "../types";

interface ResourceDetailsDrawerProps {
   resource: Resource | null;
   open: boolean;
   onClose: () => void;
   onBookmark: (id: string) => Promise<void>;
   bookmarking: boolean;
}

const categoryColors: Record<Exclude<Resource["category"], "All">, string> = {
   Housing: tokens.color.info,
   Integration: tokens.color.success,
   Language: tokens.color.warning,
   Admin: tokens.color.primary[700],
   Community: "#8B5CF6",
};

export function ResourceDetailsDrawer({
   resource,
   open,
   onClose,
   onBookmark,
   bookmarking,
}: ResourceDetailsDrawerProps) {
   if (!resource) return null;

   const categoryColor = categoryColors[resource.category];

   const renderContent = () => {
      if (resource.type === "Article" && resource.content) {
         return (
            <Box sx={{ lineHeight: 1.8 }}>
               {resource.content.split("\n").map((line, idx) => {
                  if (line.startsWith("# ")) {
                     return (
                        <Typography
                           key={idx}
                           variant="h5"
                           sx={{
                              fontSize: "1.25rem",
                              fontWeight: 800,
                              mt: idx > 0 ? 3 : 0,
                              mb: 1.5,
                              color: tokens.color.text.primary,
                           }}
                        >
                           {line.replace("# ", "")}
                        </Typography>
                     );
                  }
                  if (line.startsWith("## ")) {
                     return (
                        <Typography
                           key={idx}
                           variant="h6"
                           sx={{
                              fontSize: "1.0625rem",
                              fontWeight: 700,
                              mt: 2.5,
                              mb: 1,
                              color: tokens.color.text.primary,
                           }}
                        >
                           {line.replace("## ", "")}
                        </Typography>
                     );
                  }
                  if (line.startsWith("### ")) {
                     return (
                        <Typography
                           key={idx}
                           sx={{
                              fontSize: "0.9375rem",
                              fontWeight: 700,
                              mt: 2,
                              mb: 0.75,
                              color: tokens.color.text.primary,
                           }}
                        >
                           {line.replace("### ", "")}
                        </Typography>
                     );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                     return (
                        <Typography
                           key={idx}
                           sx={{
                              fontSize: "0.875rem",
                              fontWeight: 700,
                              mt: 1.5,
                              mb: 0.5,
                              color: tokens.color.text.primary,
                           }}
                        >
                           {line.replace(/\*\*/g, "")}
                        </Typography>
                     );
                  }
                  if (line.startsWith("- ")) {
                     return (
                        <Box
                           key={idx}
                           component="li"
                           sx={{
                              ml: 3,
                              mb: 0.5,
                              color: tokens.color.text.secondary,
                              fontSize: "0.875rem",
                           }}
                        >
                           {line.replace("- ", "")}
                        </Box>
                     );
                  }
                  if (line.match(/^\d+\./)) {
                     return (
                        <Box
                           key={idx}
                           component="li"
                           sx={{
                              ml: 3,
                              mb: 0.5,
                              color: tokens.color.text.secondary,
                              fontSize: "0.875rem",
                              listStyleType: "decimal",
                           }}
                        >
                           {line.replace(/^\d+\.\s/, "")}
                        </Box>
                     );
                  }
                  if (line.trim() === "") {
                     return <Box key={idx} sx={{ height: 8 }} />;
                  }
                  return (
                     <Typography
                        key={idx}
                        sx={{
                           fontSize: "0.875rem",
                           mb: 1,
                           color: tokens.color.text.secondary,
                           lineHeight: 1.65,
                        }}
                     >
                        {line}
                     </Typography>
                  );
               })}
            </Box>
         );
      }

      if (resource.type === "Checklist" && resource.content) {
         return (
            <Box sx={{ lineHeight: 1.8 }}>
               {resource.content.split("\n").map((line, idx) => {
                  if (line.startsWith("# ") || line.startsWith("## ")) {
                     const isH1 = line.startsWith("# ");
                     return (
                        <Typography
                           key={idx}
                           variant={isH1 ? "h5" : "h6"}
                           sx={{
                              fontSize: isH1 ? "1.25rem" : "1.0625rem",
                              fontWeight: isH1 ? 800 : 700,
                              mt: idx > 0 ? 3 : 0,
                              mb: 1.5,
                              color: tokens.color.text.primary,
                           }}
                        >
                           {line.replace(/^#+ /, "")}
                        </Typography>
                     );
                  }
                  if (line.startsWith("- [ ]")) {
                     return (
                        <Box
                           key={idx}
                           sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              mb: 0.75,
                              pl: 1,
                           }}
                        >
                           <Box
                              sx={{
                                 width: 18,
                                 height: 18,
                                 border: `2px solid ${tokens.color.border}`,
                                 borderRadius: "4px",
                                 flexShrink: 0,
                                 mt: 0.25,
                              }}
                           />
                           <Typography
                              sx={{
                                 fontSize: "0.875rem",
                                 color: tokens.color.text.secondary,
                              }}
                           >
                              {line.replace("- [ ] ", "")}
                           </Typography>
                        </Box>
                     );
                  }
                  if (line.trim() === "") {
                     return <Box key={idx} sx={{ height: 8 }} />;
                  }
                  return (
                     <Typography
                        key={idx}
                        sx={{
                           fontSize: "0.875rem",
                           mb: 1,
                           color: tokens.color.text.secondary,
                        }}
                     >
                        {line}
                     </Typography>
                  );
               })}
            </Box>
         );
      }

      if (resource.url) {
         let icon = <OpenInNewIcon />;
         let buttonText = "Visit Resource";
         let buttonColor: string = tokens.color.primary[700];

         if (resource.type === "PDF") {
            icon = <DownloadIcon />;
            buttonText = "Download PDF";
         } else if (resource.type === "Video") {
            icon = <PlayArrowIcon />;
            buttonText = "Watch Video";
            buttonColor = tokens.color.error;
         }

         return (
            <Box
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  py: 6,
               }}
            >
               <Button
                  variant="contained"
                  startIcon={icon}
                  onClick={() => window.open(resource.url, "_blank")}
                  sx={{
                     px: 3.5,
                     py: 1.25,
                     backgroundColor: buttonColor,
                     fontSize: "0.875rem",
                     fontWeight: 700,
                     textTransform: "none",
                     borderRadius: `${tokens.radius.control}px`,
                     "&:hover": {
                        backgroundColor: buttonColor,
                        filter: "brightness(0.9)",
                     },
                  }}
               >
                  {buttonText}
               </Button>
               <Typography
                  sx={{
                     fontSize: "0.8125rem",
                     color: tokens.color.text.muted,
                     textAlign: "center",
                  }}
               >
                  Opens in a new tab
               </Typography>
            </Box>
         );
      }

      return null;
   };

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         PaperProps={{
            sx: {
               width: { xs: "100%", sm: 480 },
               backgroundColor: tokens.color.background,
            },
         }}
      >
         <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header */}
            <Box
               sx={{
                  p: 2.5,
                  borderBottom: `1px solid ${tokens.color.border}`,
                  backgroundColor: tokens.color.surface,
               }}
            >
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     mb: 1.5,
                  }}
               >
                  <Chip
                     label={resource.category}
                     size="small"
                     sx={{
                        fontSize: "0.7rem",
                        height: 24,
                        backgroundColor: categoryColor,
                        color: "#fff",
                        fontWeight: 700,
                     }}
                  />
                  <IconButton onClick={onClose} size="small">
                     <CloseIcon />
                  </IconButton>
               </Box>

               <Typography
                  variant="h6"
                  sx={{
                     fontSize: "1.125rem",
                     fontWeight: 800,
                     color: tokens.color.text.primary,
                     lineHeight: 1.4,
                     mb: 1,
                  }}
               >
                  {resource.title}
               </Typography>

               <Typography
                  sx={{
                     fontSize: "0.875rem",
                     color: tokens.color.text.muted,
                     lineHeight: 1.5,
                     mb: 1.5,
                  }}
               >
                  {resource.description}
               </Typography>

               <Box
                  sx={{
                     display: "flex",
                     gap: 2,
                     alignItems: "center",
                  }}
               >
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: `${tokens.radius.control}px`,
                        backgroundColor: alpha(tokens.color.text.muted, 0.08),
                     }}
                  >
                     <AccessTimeIcon
                        sx={{ fontSize: 14, color: tokens.color.text.muted }}
                     />
                     <Typography
                        sx={{
                           fontSize: "0.75rem",
                           color: tokens.color.text.secondary,
                           fontWeight: 600,
                        }}
                     >
                        {resource.minutes} min
                     </Typography>
                  </Box>
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: `${tokens.radius.control}px`,
                        backgroundColor: alpha(tokens.color.text.muted, 0.08),
                     }}
                  >
                     <VisibilityIcon
                        sx={{ fontSize: 14, color: tokens.color.text.muted }}
                     />
                     <Typography
                        sx={{
                           fontSize: "0.75rem",
                           color: tokens.color.text.secondary,
                           fontWeight: 600,
                        }}
                     >
                        {resource.views} views
                     </Typography>
                  </Box>
                  <Chip
                     label={resource.type}
                     size="small"
                     variant="outlined"
                     sx={{
                        fontSize: "0.7rem",
                        height: 24,
                        borderColor: tokens.color.border,
                        fontWeight: 600,
                     }}
                  />
               </Box>
            </Box>

            {/* Content */}
            <Box
               sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2.5,
               }}
            >
               {renderContent()}
            </Box>

            <Divider />

            {/* Footer */}
            <Box
               sx={{
                  p: 2.5,
                  backgroundColor: tokens.color.surface,
               }}
            >
               <Button
                  fullWidth
                  variant={resource.bookmarked ? "contained" : "outlined"}
                  startIcon={
                     bookmarking ? (
                        <CircularProgress size={18} color="inherit" />
                     ) : resource.bookmarked ? (
                        <BookmarkIcon />
                     ) : (
                        <BookmarkBorderIcon />
                     )
                  }
                  onClick={() => void onBookmark(resource.id)}
                  disabled={bookmarking}
                  sx={{
                     py: 1,
                     fontSize: "0.875rem",
                     fontWeight: 700,
                     textTransform: "none",
                     borderRadius: `${tokens.radius.control}px`,
                     ...(resource.bookmarked
                        ? {
                             backgroundColor: tokens.color.primary[700],
                             "&:hover": {
                                backgroundColor: tokens.color.primary[900],
                             },
                          }
                        : {
                             borderColor: tokens.color.primary[700],
                             color: tokens.color.primary[700],
                             borderWidth: "1.5px",
                             "&:hover": {
                                backgroundColor: alpha(
                                   tokens.color.primary[700],
                                   0.06,
                                ),
                                borderColor: tokens.color.primary[700],
                                borderWidth: "1.5px",
                             },
                          }),
                  }}
               >
                  {resource.bookmarked
                     ? "Bookmarked"
                     : "Bookmark this resource"}
               </Button>
            </Box>
         </Box>
      </Drawer>
   );
}
