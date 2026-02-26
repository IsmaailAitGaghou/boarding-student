import {
   Box,
   Typography,
   Chip,
   Avatar,
   Divider,
   CircularProgress,
   alpha,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticleIcon from "@mui/icons-material/Article";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { tokens } from "@/app/theme";
import type { Resource } from "../types";

interface ResourceCardProps {
   resource: Resource;
   onBookmark: (id: string) => Promise<void>;
   onViewDetails: (id: string) => void;
   bookmarkingId?: string | null;
}

const typeIcons: Record<Resource["type"], React.ReactElement> = {
   Article: <ArticleIcon sx={{ fontSize: 20 }} />,
   PDF: <PictureAsPdfIcon sx={{ fontSize: 20 }} />,
   Link: <LinkIcon sx={{ fontSize: 20 }} />,
   Checklist: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />,
   Video: <VideoLibraryIcon sx={{ fontSize: 20 }} />,
};

const categoryColors: Record<Exclude<Resource["category"], "All">, string> = {
   Housing: tokens.color.info,
   Integration: tokens.color.success,
   Language: tokens.color.warning,
   Admin: tokens.color.primary[700],
   Community: "#8B5CF6",
};

export function ResourceCard({
   resource,
   onBookmark,
   onViewDetails,
   bookmarkingId,
}: ResourceCardProps) {
   const isBookmarking = bookmarkingId === resource.id;
   const categoryColor = categoryColors[resource.category];

   return (
      <Box
         sx={{
            border: `1px solid ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.color.surface,
            boxShadow: "none",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": {
               borderColor: alpha(tokens.color.primary[300], 0.3),
               boxShadow: tokens.shadow.sm,
            },
         }}
      >
         {/* Header: icon + meta + category badge */}
         <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Avatar
               sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: alpha(categoryColor, 0.12),
                  color: categoryColor,
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {typeIcons[resource.type]}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Typography
                  variant="subtitle2"
                  sx={{
                     fontWeight: 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.3,
                     mb: 0.25,
                     display: "-webkit-box",
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: "vertical",
                     overflow: "hidden",
                  }}
               >
                  {resource.title}
               </Typography>
               <Chip
                  label={resource.category}
                  size="small"
                  sx={{
                     fontSize: "0.7rem",
                     height: 20,
                     backgroundColor: categoryColor,
                     color: "#fff",
                     fontWeight: 600,
                  }}
               />
            </Box>

            {/* Type badge */}
            <Box
               sx={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
               }}
            >
               <Box
                  sx={{
                     px: 1.25,
                     py: 0.5,
                     borderRadius: `${tokens.radius.control}px`,
                     border: `1.5px solid ${tokens.color.border}`,
                     backgroundColor: alpha(tokens.color.text.muted, 0.04),
                  }}
               >
                  <Typography
                     sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: tokens.color.text.secondary,
                        lineHeight: 1,
                     }}
                  >
                     {resource.type}
                  </Typography>
               </Box>
            </Box>
         </Box>

         {/* Meta row */}
         <Box
            sx={{
               display: "flex",
               gap: 1.5,
               flexWrap: "wrap",
               alignItems: "center",
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <AccessTimeIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted }}
               >
                  {resource.minutes} min read
               </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <VisibilityIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted }}
               >
                  {resource.views} views
               </Typography>
            </Box>
         </Box>

         {/* Description */}
         <Typography
            variant="body2"
            sx={{
               color: tokens.color.text.secondary,
               display: "-webkit-box",
               WebkitLineClamp: 2,
               WebkitBoxOrient: "vertical",
               overflow: "hidden",
               lineHeight: 1.55,
               fontSize: "0.8rem",
            }}
         >
            {resource.description}
         </Typography>

         <Divider sx={{ borderColor: tokens.color.border }} />

         {/* Actions */}
         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* View Details */}
            <Box
               component="button"
               onClick={() => onViewDetails(resource.id)}
               sx={{
                  flex: 1,
                  py: 0.75,
                  px: 1.5,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${tokens.color.primary[700]}`,
                  backgroundColor: "transparent",
                  color: tokens.color.primary[700],
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "background-color 0.15s",
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                  },
               }}
            >
               View details
            </Box>

            {/* Bookmark */}
            <Box
               component="button"
               onClick={() => {
                  void onBookmark(resource.id);
               }}
               disabled={isBookmarking}
               sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  py: 0.75,
                  px: 1.25,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${
                     resource.bookmarked
                        ? tokens.color.primary[700]
                        : tokens.color.border
                  }`,
                  backgroundColor: resource.bookmarked
                     ? alpha(tokens.color.primary[700], 0.06)
                     : "transparent",
                  color: resource.bookmarked
                     ? tokens.color.primary[700]
                     : tokens.color.text.muted,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  cursor: isBookmarking ? "default" : "pointer",
                  transition: "all 0.15s",
                  "&:hover:not(:disabled)": {
                     borderColor: tokens.color.primary[500],
                     color: tokens.color.primary[700],
                     backgroundColor: alpha(tokens.color.primary[700], 0.04),
                  },
               }}
            >
               {isBookmarking ? (
                  <CircularProgress
                     size={14}
                     sx={{ color: tokens.color.primary[700] }}
                  />
               ) : resource.bookmarked ? (
                  <BookmarkIcon sx={{ fontSize: 16 }} />
               ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 16 }} />
               )}
               {resource.bookmarked ? "Saved" : "Save"}
            </Box>
         </Box>
      </Box>
   );
}
