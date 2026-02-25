import { useState } from "react";
import {
   Box,
   Typography,
   Chip,
   Button,
   Collapse,
   Stack,
   Divider,
   alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LaunchIcon from "@mui/icons-material/Launch";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";
import { getStatusColor, getStatusLabel, formatJourneyDate } from "../api";
import type { JourneyStep } from "../types";

interface JourneyStepCardProps {
   step: JourneyStep;
   stepNumber: number;
   isLast?: boolean;
}

export function JourneyStepCard({
   step,
   stepNumber,
   isLast,
}: JourneyStepCardProps) {
   const [expanded, setExpanded] = useState(step.status === "in_progress");
   const navigate = useNavigate();

   const isCompleted = step.status === "completed";
   const isActive = step.status === "in_progress";
   const isBlocked = step.status === "blocked";

   const hasDetails =
      step.notes ||
      step.advisorNotes ||
      (step.requiredDocuments && step.requiredDocuments.length > 0) ||
      (step.actions && step.actions.length > 0);

   const handleActionClick = (type: string, path?: string, url?: string) => {
      if (type === "navigate" && path) {
         navigate(path);
      } else if (type === "external" && url) {
         window.open(url, "_blank", "noopener,noreferrer");
      } else if (type === "schedule" && path) {
         navigate(path);
      } else if (type === "upload" && path) {
         navigate(path);
      }
   };

   const getStatusIcon = () => {
      if (isCompleted)
         return (
            <CheckCircleIcon
               sx={{ fontSize: 20, color: tokens.color.primary[700] }}
            />
         );
      if (isActive)
         return (
            <AccessTimeIcon
               sx={{ fontSize: 20, color: tokens.color.primary[500] }}
            />
         );
      if (isBlocked)
         return <BlockIcon sx={{ fontSize: 20, color: tokens.color.error }} />;
      return (
         <RadioButtonUncheckedIcon
            sx={{ fontSize: 20, color: tokens.color.text.muted }}
         />
      );
   };

   const dotColor = isCompleted
      ? tokens.color.primary[700]
      : isActive
      ? tokens.color.primary[500]
      : isBlocked
      ? tokens.color.error
      : tokens.color.border;

   const lineColor = isCompleted
      ? tokens.color.primary[700]
      : tokens.color.border;

   return (
      <Box sx={{ display: "flex", gap: 0 }}>
         {/* Left: step dot + connector line */}
         <Box
            sx={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               flexShrink: 0,
               width: 40,
               mr: 2,
            }}
         >
            {/* Dot */}
            <Box
               sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: `2px solid ${dotColor}`,
                  backgroundColor: isCompleted
                     ? alpha(tokens.color.primary[700], 0.08)
                     : isActive
                     ? alpha(tokens.color.primary[500], 0.08)
                     : "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
               }}
            >
               {getStatusIcon()}
            </Box>

            {/* Connector line */}
            {!isLast && (
               <Box
                  sx={{
                     flex: 1,
                     width: 2,
                     minHeight: 24,
                     backgroundColor: lineColor,
                     mt: 0.5,
                     mb: 0,
                     borderRadius: 1,
                     transition: "background-color 300ms",
                  }}
               />
            )}
         </Box>

         {/* Right: card content */}
         <Box sx={{ flex: 1, pb: isLast ? 0 : 3 }}>
            {/* Step number label */}
            <Typography
               variant="caption"
               sx={{
                  color: tokens.color.text.muted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.6875rem",
                  mb: 0.5,
                  display: "block",
               }}
            >
               Step {stepNumber}
            </Typography>

            {/* Main card */}
            <Box
               sx={{
                  border: `1.5px solid`,
                  borderColor: isActive
                     ? tokens.color.primary[700]
                     : tokens.color.border,
                  borderRadius: `${tokens.radius.card}px`,
                  backgroundColor: isActive
                     ? alpha(tokens.color.primary[700], 0.025)
                     : "background.paper",
                  overflow: "hidden",
                  transition: "border-color 200ms, background-color 200ms",
               }}
            >
               {/* Card header */}
               <Box
                  sx={{
                     px: 2.5,
                     pt: 2,
                     pb: hasDetails ? 1.5 : 2,
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "flex-start",
                     gap: 1,
                  }}
               >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                     {/* Title row */}
                     <Box
                        sx={{
                           display: "flex",
                           alignItems: "center",
                           gap: 1,
                           flexWrap: "wrap",
                           mb: 0.5,
                        }}
                     >
                        <Typography
                           variant="h3"
                           sx={{
                              fontWeight: 700,
                              fontSize: "1rem",
                              lineHeight: 1.4,
                              color: isActive
                                 ? tokens.color.primary[700]
                                 : tokens.color.text.primary,
                           }}
                        >
                           {step.title}
                        </Typography>

                        <Chip
                           label={getStatusLabel(step.status)}
                           size="small"
                           sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              backgroundColor: alpha(
                                 getStatusColor(step.status),
                                 0.1,
                              ),
                              color: getStatusColor(step.status),
                              border: `1px solid ${alpha(
                                 getStatusColor(step.status),
                                 0.2,
                              )}`,
                              "& .MuiChip-label": { px: 1 },
                           }}
                        />
                     </Box>

                     {/* Date */}
                     {step.date && (
                        <Typography
                           variant="caption"
                           color="text.secondary"
                           sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 1,
                           }}
                        >
                           <CalendarTodayIcon sx={{ fontSize: 12 }} />
                           {formatJourneyDate(step.date)}
                        </Typography>
                     )}

                     {/* Description */}
                     <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                     >
                        {step.description}
                     </Typography>
                  </Box>

                  {/* Expand button */}
                  {hasDetails && (
                     <Box
                        component="button"
                        onClick={() => setExpanded(!expanded)}
                        aria-label={
                           expanded ? "Collapse details" : "Expand details"
                        }
                        aria-expanded={expanded}
                        sx={{
                           flexShrink: 0,
                           width: 28,
                           height: 28,
                           borderRadius: "50%",
                           border: `1px solid ${tokens.color.border}`,
                           backgroundColor: "transparent",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           cursor: "pointer",
                           color: tokens.color.text.muted,
                           transition: "border-color 150ms, color 150ms",
                           "&:hover": {
                              borderColor: tokens.color.primary[700],
                              color: tokens.color.primary[700],
                           },
                           mt: 0.25,
                        }}
                     >
                        {expanded ? (
                           <ExpandLessIcon sx={{ fontSize: 16 }} />
                        ) : (
                           <ExpandMoreIcon sx={{ fontSize: 16 }} />
                        )}
                     </Box>
                  )}
               </Box>

               {/* Expandable details */}
               {hasDetails && (
                  <Collapse in={expanded}>
                     <Divider sx={{ borderColor: tokens.color.border }} />
                     <Box sx={{ px: 2.5, py: 2 }}>
                        <Stack spacing={2}>
                           {/* Notes */}
                           {step.notes && (
                              <Box>
                                 <Typography
                                    variant="caption"
                                    sx={{
                                       fontWeight: 700,
                                       textTransform: "uppercase",
                                       color: "text.secondary",
                                       letterSpacing: "0.05em",
                                       display: "flex",
                                       alignItems: "center",
                                       gap: 0.5,
                                       mb: 0.75,
                                    }}
                                 >
                                    <ArticleOutlinedIcon
                                       sx={{ fontSize: 14 }}
                                    />
                                    Notes
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    color="text.secondary"
                                 >
                                    {step.notes}
                                 </Typography>
                              </Box>
                           )}

                           {/* Advisor notes */}
                           {step.advisorNotes && (
                              <Box
                                 sx={{
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    backgroundColor: alpha(
                                       tokens.color.primary[700],
                                       0.04,
                                    ),
                                    border: `1px solid ${alpha(
                                       tokens.color.primary[700],
                                       0.12,
                                    )}`,
                                 }}
                              >
                                 <Typography
                                    variant="caption"
                                    sx={{
                                       fontWeight: 700,
                                       textTransform: "uppercase",
                                       color: tokens.color.primary[700],
                                       letterSpacing: "0.05em",
                                       display: "flex",
                                       alignItems: "center",
                                       gap: 0.5,
                                       mb: 0.75,
                                    }}
                                 >
                                    <PersonOutlineIcon sx={{ fontSize: 14 }} />
                                    Advisor Note
                                 </Typography>
                                 <Typography
                                    variant="body2"
                                    sx={{
                                       color: tokens.color.text.secondary,
                                       fontStyle: "italic",
                                    }}
                                 >
                                    {step.advisorNotes}
                                 </Typography>
                              </Box>
                           )}

                           {/* Required documents */}
                           {step.requiredDocuments &&
                              step.requiredDocuments.length > 0 && (
                                 <Box>
                                    <Typography
                                       variant="caption"
                                       sx={{
                                          fontWeight: 700,
                                          textTransform: "uppercase",
                                          color: "text.secondary",
                                          letterSpacing: "0.05em",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 0.5,
                                          mb: 0.75,
                                       }}
                                    >
                                       <FolderOutlinedIcon
                                          sx={{ fontSize: 14 }}
                                       />
                                       Required Documents
                                    </Typography>
                                    <Stack spacing={0.5}>
                                       {step.requiredDocuments.map(
                                          (doc, idx) => (
                                             <Typography
                                                key={idx}
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: 1,
                                                }}
                                             >
                                                <Box
                                                   sx={{
                                                      width: 5,
                                                      height: 5,
                                                      borderRadius: "50%",
                                                      flexShrink: 0,
                                                      backgroundColor:
                                                         tokens.color
                                                            .primary[700],
                                                   }}
                                                />
                                                {doc}
                                             </Typography>
                                          ),
                                       )}
                                    </Stack>
                                 </Box>
                              )}

                           {/* Actions */}
                           {step.actions && step.actions.length > 0 && (
                              <Stack
                                 direction="row"
                                 spacing={1}
                                 flexWrap="wrap"
                              >
                                 {step.actions.map((action) => (
                                    <Button
                                       key={action.id}
                                       size="small"
                                       variant={
                                          isActive ? "contained" : "outlined"
                                       }
                                       endIcon={
                                          action.type === "external" ? (
                                             <LaunchIcon fontSize="small" />
                                          ) : (
                                             <ArrowForwardIcon fontSize="small" />
                                          )
                                       }
                                       onClick={() =>
                                          handleActionClick(
                                             action.type,
                                             action.path,
                                             action.url,
                                          )
                                       }
                                       sx={
                                          isActive
                                             ? {
                                                  backgroundColor:
                                                     tokens.color.primary[700],
                                                  fontWeight: 600,
                                                  "&:hover": {
                                                     backgroundColor:
                                                        tokens.color
                                                           .primary[900],
                                                  },
                                               }
                                             : {
                                                  borderColor:
                                                     tokens.color.border,
                                                  color: tokens.color.text
                                                     .primary,
                                                  fontWeight: 600,
                                                  "&:hover": {
                                                     borderColor:
                                                        tokens.color
                                                           .primary[700],
                                                     color: tokens.color
                                                        .primary[700],
                                                     backgroundColor: alpha(
                                                        tokens.color
                                                           .primary[700],
                                                        0.04,
                                                     ),
                                                  },
                                               }
                                       }
                                    >
                                       {action.label}
                                    </Button>
                                 ))}
                              </Stack>
                           )}
                        </Stack>
                     </Box>
                  </Collapse>
               )}
            </Box>
         </Box>
      </Box>
   );
}
