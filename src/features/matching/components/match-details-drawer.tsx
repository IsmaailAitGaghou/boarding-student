import {
   Box,
   Drawer,
   Typography,
   Avatar,
   Chip,
   Divider,
   CircularProgress,
   alpha,
   IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventIcon from "@mui/icons-material/Event";
import { tokens } from "@/app/theme";
import { getScoreColor } from "../api";
import type { Match } from "../types";

interface MatchDetailsDrawerProps {
   match: Match | null;
   open: boolean;
   onClose: () => void;
   onSave: (id: string) => Promise<void>;
   onApply: (id: string) => Promise<void>;
   saving?: boolean;
   applying?: boolean;
}

export function MatchDetailsDrawer({
   match,
   open,
   onClose,
   onSave,
   onApply,
   saving,
   applying,
}: MatchDetailsDrawerProps) {
   if (!match) return null;

   const scoreColor = getScoreColor(match.matchScore);

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         PaperProps={{
            sx: {
               width: { xs: "100%", sm: 580 },
               display: "flex",
               flexDirection: "column",
               overflow: "hidden",
            },
         }}
      >
         {/* Header */}
         <Box
            sx={{
               px: 2.5,
               pt: 2.5,
               pb: 2,
               borderBottom: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 1.5,
               alignItems: "flex-start",
            }}
         >
            <Avatar
               sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(tokens.color.primary[700], 0.12),
                  color: tokens.color.primary[700],
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {match.companyName.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Typography
                  variant="subtitle1"
                  sx={{
                     fontWeight: 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.3,
                  }}
               >
                  {match.role}
               </Typography>
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.secondary,
                     fontWeight: 500,
                     mt: 0.25,
                  }}
               >
                  {match.companyName}
               </Typography>
            </Box>

            <IconButton
               onClick={onClose}
               size="small"
               sx={{ color: tokens.color.text.muted, flexShrink: 0 }}
            >
               <CloseIcon fontSize="small" />
            </IconButton>
         </Box>

         {/* Score + meta row */}
         <Box
            sx={{
               px: 2.5,
               py: 1.75,
               borderBottom: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 2,
               alignItems: "center",
               flexWrap: "wrap",
            }}
         >
            {/* Score badge */}
            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  py: 0.5,
                  px: 1.25,
                  borderRadius: `${tokens.radius.control}px`,
                  backgroundColor: alpha(scoreColor, 0.1),
                  border: `1px solid ${alpha(scoreColor, 0.3)}`,
               }}
            >
               <CheckCircleIcon sx={{ fontSize: 14, color: scoreColor }} />
               <Typography
                  sx={{
                     fontSize: "0.85rem",
                     fontWeight: 800,
                     color: scoreColor,
                  }}
               >
                  {match.matchScore}% Match
               </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <LocationOnOutlinedIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.secondary }}
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
                  sx={{ color: tokens.color.text.secondary }}
               >
                  {match.type}
               </Typography>
            </Box>

            {match.salary && (
               <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AttachMoneyIcon
                     sx={{ fontSize: 14, color: tokens.color.text.muted }}
                  />
                  <Typography
                     variant="caption"
                     sx={{ color: tokens.color.text.secondary }}
                  >
                     {match.salary}
                  </Typography>
               </Box>
            )}
         </Box>

         {/* Scrollable body */}
         <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>
            {/* Company info */}
            <Box sx={{ mb: 2 }}>
               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                     <PeopleOutlineIcon
                        sx={{ fontSize: 14, color: tokens.color.text.muted }}
                     />
                     <Typography
                        variant="caption"
                        sx={{ color: tokens.color.text.muted }}
                     >
                        {match.companySize}
                     </Typography>
                  </Box>
                  {match.startDate && (
                     <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                     >
                        <EventIcon
                           sx={{ fontSize: 14, color: tokens.color.text.muted }}
                        />
                        <Typography
                           variant="caption"
                           sx={{ color: tokens.color.text.muted }}
                        >
                           Starts {match.startDate}
                        </Typography>
                     </Box>
                  )}
               </Box>
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.secondary,
                     lineHeight: 1.65,
                     fontSize: "0.82rem",
                  }}
               >
                  {match.companyDescription}
               </Typography>
            </Box>

            <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />

            {/* Description */}
            <SectionBlock title="About the role">
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.secondary,
                     lineHeight: 1.65,
                     fontSize: "0.82rem",
                  }}
               >
                  {match.description}
               </Typography>
            </SectionBlock>

            {/* Why it matches */}
            {match.matchReasons.length > 0 && (
               <>
                  <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />
                  <SectionBlock title="Why you match">
                     <Box
                        sx={{
                           display: "flex",
                           flexDirection: "column",
                           gap: 0.75,
                        }}
                     >
                        {match.matchReasons.map((reason, i) => (
                           <Box
                              key={i}
                              sx={{
                                 display: "flex",
                                 alignItems: "flex-start",
                                 gap: 1,
                              }}
                           >
                              <CheckCircleIcon
                                 sx={{
                                    fontSize: 15,
                                    color: tokens.color.success,
                                    mt: "2px",
                                    flexShrink: 0,
                                 }}
                              />
                              <Typography
                                 variant="body2"
                                 sx={{
                                    color: tokens.color.text.secondary,
                                    fontSize: "0.82rem",
                                    lineHeight: 1.55,
                                 }}
                              >
                                 {reason}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  </SectionBlock>
               </>
            )}

            {/* Requirements */}
            {match.requirements.length > 0 && (
               <>
                  <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />
                  <SectionBlock title="Requirements">
                     <Box
                        component="ul"
                        sx={{
                           m: 0,
                           pl: 2.5,
                           display: "flex",
                           flexDirection: "column",
                           gap: 0.5,
                        }}
                     >
                        {match.requirements.map((req, i) => (
                           <Box
                              component="li"
                              key={i}
                              sx={{
                                 color: tokens.color.text.secondary,
                                 fontSize: "0.82rem",
                                 lineHeight: 1.55,
                              }}
                           >
                              {req}
                           </Box>
                        ))}
                     </Box>
                  </SectionBlock>
               </>
            )}

            {/* Responsibilities */}
            {match.responsibilities.length > 0 && (
               <>
                  <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />
                  <SectionBlock title="Responsibilities">
                     <Box
                        component="ul"
                        sx={{
                           m: 0,
                           pl: 2.5,
                           display: "flex",
                           flexDirection: "column",
                           gap: 0.5,
                        }}
                     >
                        {match.responsibilities.map((resp, i) => (
                           <Box
                              component="li"
                              key={i}
                              sx={{
                                 color: tokens.color.text.secondary,
                                 fontSize: "0.82rem",
                                 lineHeight: 1.55,
                              }}
                           >
                              {resp}
                           </Box>
                        ))}
                     </Box>
                  </SectionBlock>
               </>
            )}

            {/* Tags */}
            {match.tags.length > 0 && (
               <>
                  <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />
                  <SectionBlock title="Skills & tags">
                     <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                        {match.tags.map((tag) => (
                           <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                 fontSize: "0.72rem",
                                 height: 24,
                                 borderRadius: `${tokens.radius.control}px`,
                                 backgroundColor: alpha(
                                    tokens.color.primary[700],
                                    0.07,
                                 ),
                                 color: tokens.color.primary[700],
                                 fontWeight: 600,
                              }}
                           />
                        ))}
                     </Box>
                  </SectionBlock>
               </>
            )}
         </Box>

         {/* Sticky footer */}
         <Box
            sx={{
               px: 2.5,
               py: 2,
               borderTop: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 1.5,
            }}
         >
            {/* Save */}
            <Box
               component="button"
               onClick={() => {
                  void onSave(match.id);
               }}
               disabled={saving}
               sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  py: 1,
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
                     : tokens.color.text.secondary,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: saving ? "default" : "pointer",
                  transition: "all 0.15s",
                  "&:hover:not(:disabled)": {
                     borderColor: tokens.color.primary[700],
                     color: tokens.color.primary[700],
                     backgroundColor: alpha(tokens.color.primary[700], 0.04),
                  },
               }}
            >
               {saving ? (
                  <CircularProgress
                     size={15}
                     sx={{ color: tokens.color.primary[700] }}
                  />
               ) : match.saved ? (
                  <BookmarkIcon sx={{ fontSize: 18 }} />
               ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 18 }} />
               )}
               {match.saved ? "Saved" : "Save"}
            </Box>

            {/* Apply */}
            {match.applied ? (
               <Box
                  sx={{
                     flex: 2,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 0.75,
                     py: 1,
                     borderRadius: `${tokens.radius.control}px`,
                     border: `1.5px solid ${tokens.color.success}`,
                     backgroundColor: alpha(tokens.color.success, 0.06),
                     color: tokens.color.success,
                     fontWeight: 700,
                     fontSize: "0.85rem",
                  }}
               >
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  Applied
               </Box>
            ) : (
               <Box
                  component="button"
                  onClick={() => {
                     void onApply(match.id);
                  }}
                  disabled={applying}
                  sx={{
                     flex: 2,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 0.75,
                     py: 1,
                     borderRadius: `${tokens.radius.control}px`,
                     border: "none",
                     backgroundColor: tokens.color.primary[700],
                     color: "#fff",
                     fontWeight: 700,
                     fontSize: "0.85rem",
                     cursor: applying ? "default" : "pointer",
                     transition: "background-color 0.15s",
                     "&:hover:not(:disabled)": {
                        backgroundColor: tokens.color.primary[900],
                     },
                  }}
               >
                  {applying ? (
                     <CircularProgress size={15} sx={{ color: "#fff" }} />
                  ) : null}
                  Apply now
               </Box>
            )}
         </Box>
      </Drawer>
   );
}

// ── Section block helper ────────────────────────────────────────────────────
function SectionBlock({
   title,
   children,
}: {
   title: string;
   children: React.ReactNode;
}) {
   return (
      <Box>
         <Typography
            variant="caption"
            sx={{
               display: "block",
               mb: 1,
               fontWeight: 700,
               color: tokens.color.text.muted,
               textTransform: "uppercase",
               letterSpacing: "0.06em",
               fontSize: "0.7rem",
            }}
         >
            {title}
         </Typography>
         {children}
      </Box>
   );
}
