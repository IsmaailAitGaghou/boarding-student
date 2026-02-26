import {
   Box,
   Typography,
   Avatar,
   Button,
   Chip,
   Divider,
   alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";
import { getScoreColor } from "@/features/matching/api";
import type { RecommendedMatch } from "../types";

type RecommendedMatchesProps = {
   matches: RecommendedMatch[];
};

export function RecommendedMatches({ matches }: RecommendedMatchesProps) {
   const navigate = useNavigate();

   if (!matches || matches.length === 0) return null;

   return (
      <Box
         sx={{
            border: `1px solid ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.color.surface,
            p: 2.5,
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": {
               border: `1px solid ${alpha(tokens.color.primary[300], 0.3)}`,
                              boxShadow: tokens.shadow.sm,
            },
         }}
      >
         {/* Header */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               mb: 2,
            }}
         >
            <Typography
               variant="h3"
               sx={{ fontWeight: 700, color: tokens.color.text.primary }}
            >
               Recommended Matches
            </Typography>
            <Button
               size="small"
               endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
               onClick={() => navigate("/matching")}
               sx={{
                  textTransform: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: tokens.color.primary[700],
                  px: 1,
                  minWidth: 0,
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                  },
               }}
            >
               View all
            </Button>
         </Box>

         {/* Match rows */}
         <Box sx={{ display: "flex", flexDirection: "column" }}>
            {matches.map((match, idx) => {
               const scoreColor = getScoreColor(match.matchPercentage);

               return (
                  <Box key={match.id}>
                     <Box
                        onClick={() => navigate("/matching")}
                        sx={{
                           py: 1.5,
                           display: "flex",
                           gap: 1.5,
                           alignItems: "flex-start",
                           cursor: "pointer",
                           borderRadius: `${tokens.radius.control}px`,
                           px: 1,
                           mx: -1,
                           transition: "background-color 0.15s",
                           "&:hover": {
                              backgroundColor: alpha(
                                 tokens.color.primary[700],
                                 0.03,
                              ),
                           },
                        }}
                     >
                        {/* Avatar */}
                        <Avatar
                           sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: alpha(
                                 tokens.color.primary[700],
                                 0.12,
                              ),
                              color: tokens.color.primary[700],
                              fontSize: "1rem",
                              fontWeight: 700,
                              borderRadius: `${tokens.radius.control}px`,
                              flexShrink: 0,
                           }}
                        >
                           {match.companyName.charAt(0)}
                        </Avatar>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                           {/* Role + score */}
                           <Box
                              sx={{
                                 display: "flex",
                                 alignItems: "flex-start",
                                 justifyContent: "space-between",
                                 gap: 1,
                                 mb: 0.25,
                              }}
                           >
                              <Typography
                                 variant="body2"
                                 sx={{
                                    fontWeight: 700,
                                    color: tokens.color.text.primary,
                                    lineHeight: 1.3,
                                 }}
                              >
                                 {match.position}
                              </Typography>
                              {/* Score badge */}
                              <Box
                                 sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    flexShrink: 0,
                                    backgroundColor: alpha(scoreColor, 0.1),
                                    border: `1px solid ${alpha(
                                       scoreColor,
                                       0.25,
                                    )}`,
                                    borderRadius: "6px",
                                    px: 0.75,
                                    py: 0.25,
                                 }}
                              >
                                 <Typography
                                    variant="caption"
                                    sx={{
                                       fontWeight: 800,
                                       fontSize: "0.75rem",
                                       color: scoreColor,
                                       lineHeight: 1,
                                    }}
                                 >
                                    {match.matchPercentage}%
                                 </Typography>
                              </Box>
                           </Box>

                           {/* Company name */}
                           <Typography
                              variant="caption"
                              sx={{
                                 color: tokens.color.text.secondary,
                                 fontWeight: 500,
                                 fontSize: "0.75rem",
                                 display: "block",
                                 mb: 0.5,
                              }}
                           >
                              {match.companyName}
                           </Typography>

                           {/* Meta row: location + type */}
                           <Box
                              sx={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 1.5,
                                 flexWrap: "wrap",
                              }}
                           >
                              <Box
                                 sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                 }}
                              >
                                 <LocationOnOutlinedIcon
                                    sx={{
                                       fontSize: 13,
                                       color: tokens.color.text.muted,
                                    }}
                                 />
                                 <Typography
                                    variant="caption"
                                    sx={{
                                       color: tokens.color.text.muted,
                                       fontSize: "0.6875rem",
                                    }}
                                 >
                                    {match.location}
                                 </Typography>
                              </Box>
                              {match.type && (
                                 <Box
                                    sx={{
                                       display: "flex",
                                       alignItems: "center",
                                       gap: 0.5,
                                    }}
                                 >
                                    <WorkOutlineIcon
                                       sx={{
                                          fontSize: 13,
                                          color: tokens.color.text.muted,
                                       }}
                                    />
                                    <Typography
                                       variant="caption"
                                       sx={{
                                          color: tokens.color.text.muted,
                                          fontSize: "0.6875rem",
                                       }}
                                    >
                                       {match.type}
                                    </Typography>
                                 </Box>
                              )}
                              {/* Tags */}
                              {match.tags?.slice(0, 2).map((tag) => (
                                 <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                       height: 18,
                                       fontSize: "0.625rem",
                                       fontWeight: 600,
                                       backgroundColor: alpha(
                                          tokens.color.primary[700],
                                          0.08,
                                       ),
                                       color: tokens.color.primary[700],
                                       "& .MuiChip-label": { px: 0.75 },
                                    }}
                                 />
                              ))}
                           </Box>
                        </Box>

                        {/* Saved bookmark icon */}
                        <Box
                           sx={{
                              flexShrink: 0,
                              color: tokens.color.text.muted,
                              pt: 0.25,
                           }}
                        >
                           {match.saved ? (
                              <BookmarkIcon
                                 sx={{
                                    fontSize: 18,
                                    color: tokens.color.primary[700],
                                 }}
                              />
                           ) : (
                              <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                           )}
                        </Box>
                     </Box>

                     {idx < matches.length - 1 && (
                        <Divider sx={{ borderColor: tokens.color.border }} />
                     )}
                  </Box>
               );
            })}
         </Box>
      </Box>
   );
}
