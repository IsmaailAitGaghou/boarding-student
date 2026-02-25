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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { tokens } from "@/app/theme";
import { getScoreColor } from "../api";
import type { Match } from "../types";

interface MatchCardProps {
   match: Match;
   onSave: (id: string) => Promise<void>;
   onApply: (id: string) => Promise<void>;
   onViewDetails: (id: string) => void;
   savingId?: string | null;
   applyingId?: string | null;
}

export function MatchCard({
   match,
   onSave,
   onApply,
   onViewDetails,
   savingId,
   applyingId,
}: MatchCardProps) {
   const scoreColor = getScoreColor(match.matchScore);
   const isSaving = savingId === match.id;
   const isApplying = applyingId === match.id;

   return (
      <Box
         sx={{
            border: `1px solid ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: "#fff",
            boxShadow: "none",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": {
               borderColor: tokens.color.primary[300],
               boxShadow: tokens.shadow.sm,
            },
         }}
      >
         {/* Header: avatar + meta + score */}
         <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Avatar
               sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: alpha(tokens.color.primary[700], 0.12),
                  color: tokens.color.primary[700],
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {match.companyName.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Typography
                  variant="subtitle2"
                  sx={{
                     fontWeight: 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.3,
                     mb: 0.25,
                  }}
               >
                  {match.role}
               </Typography>
               <Typography
                  variant="body2"
                  sx={{ color: tokens.color.text.secondary, fontWeight: 500 }}
               >
                  {match.companyName}
               </Typography>
            </Box>

            {/* Score badge */}
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
                     width: 52,
                     height: 52,
                     borderRadius: "50%",
                     border: `3px solid ${scoreColor}`,
                     backgroundColor: alpha(scoreColor, 0.08),
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  <Typography
                     sx={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: scoreColor,
                        lineHeight: 1,
                     }}
                  >
                     {match.matchScore}%
                  </Typography>
               </Box>
               <Typography
                  sx={{
                     fontSize: "0.65rem",
                     color: tokens.color.text.muted,
                     fontWeight: 600,
                  }}
               >
                  match
               </Typography>
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
               <LocationOnOutlinedIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted }}
               >
                  {match.location}
               </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <WorkOutlineIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted }}
               >
                  {match.type}
               </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <BusinessIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted }}
               >
                  {match.companyIndustry}
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
            {match.description}
         </Typography>

         {/* Tags */}
         <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {match.tags.slice(0, 4).map((tag) => (
               <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                     fontSize: "0.7rem",
                     height: 22,
                     borderRadius: `${tokens.radius.control}px`,
                     backgroundColor: alpha(tokens.color.primary[700], 0.07),
                     color: tokens.color.primary[700],
                     fontWeight: 600,
                  }}
               />
            ))}
            {match.tags.length > 4 && (
               <Chip
                  label={`+${match.tags.length - 4}`}
                  size="small"
                  sx={{
                     fontSize: "0.7rem",
                     height: 22,
                     borderRadius: `${tokens.radius.control}px`,
                     backgroundColor: alpha(tokens.color.text.muted, 0.08),
                     color: tokens.color.text.muted,
                     fontWeight: 600,
                  }}
               />
            )}
         </Box>

         <Divider sx={{ borderColor: tokens.color.border }} />

         {/* Actions */}
         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* View Details */}
            <Box
               component="button"
               onClick={() => onViewDetails(match.id)}
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

            {/* Save */}
            <Box
               component="button"
               onClick={() => {
                  void onSave(match.id);
               }}
               disabled={isSaving}
               sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  py: 0.75,
                  px: 1.25,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${
                     match.saved
                        ? tokens.color.primary[700]
                        : tokens.color.border
                  }`,
                  backgroundColor: match.saved
                     ? alpha(tokens.color.primary[700], 0.06)
                     : "transparent",
                  color: match.saved
                     ? tokens.color.primary[700]
                     : tokens.color.text.muted,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  cursor: isSaving ? "default" : "pointer",
                  transition: "all 0.15s",
                  "&:hover:not(:disabled)": {
                     borderColor: tokens.color.primary[500],
                     color: tokens.color.primary[700],
                     backgroundColor: alpha(tokens.color.primary[700], 0.04),
                  },
               }}
            >
               {isSaving ? (
                  <CircularProgress
                     size={14}
                     sx={{ color: tokens.color.primary[700] }}
                  />
               ) : match.saved ? (
                  <BookmarkIcon sx={{ fontSize: 16 }} />
               ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 16 }} />
               )}
               {match.saved ? "Saved" : "Save"}
            </Box>

            {/* Apply */}
            {match.applied ? (
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 0.5,
                     py: 0.75,
                     px: 1.25,
                     borderRadius: `${tokens.radius.control}px`,
                     border: `1.5px solid ${tokens.color.success}`,
                     backgroundColor: alpha(tokens.color.success, 0.06),
                     color: tokens.color.success,
                     fontWeight: 700,
                     fontSize: "0.78rem",
                  }}
               >
                  <CheckCircleIcon sx={{ fontSize: 14 }} />
                  Applied
               </Box>
            ) : (
               <Box
                  component="button"
                  onClick={() => {
                     void onApply(match.id);
                  }}
                  disabled={isApplying}
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 0.5,
                     py: 0.75,
                     px: 1.25,
                     borderRadius: `${tokens.radius.control}px`,
                     border: "none",
                     backgroundColor: tokens.color.primary[700],
                     color: "#fff",
                     fontWeight: 700,
                     fontSize: "0.78rem",
                     cursor: isApplying ? "default" : "pointer",
                     transition: "background-color 0.15s",
                     "&:hover:not(:disabled)": {
                        backgroundColor: tokens.color.primary[900],
                     },
                  }}
               >
                  {isApplying ? (
                     <CircularProgress size={14} sx={{ color: "#fff" }} />
                  ) : null}
                  Apply
               </Box>
            )}
         </Box>
      </Box>
   );
}
