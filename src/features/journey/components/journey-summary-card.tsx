import { Box, Typography, LinearProgress, Chip, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { tokens } from "@/app/theme";
import type { JourneySummary } from "../types";

interface JourneySummaryCardProps {
   summary: JourneySummary;
}

export function JourneySummaryCard({ summary }: JourneySummaryCardProps) {
   const pending =
      summary.totalSteps -
      summary.completedSteps -
      (summary.currentStep ? 1 : 0);

   return (
      <Box
         sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: `${tokens.radius.card}px`,
            border: `1px solid ${tokens.color.border}`,
            backgroundColor: "background.paper",
         }}
      >
         {/* Top row: percent + step counters */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               gap: { xs: 2, sm: 3 },
               flexWrap: "wrap",
               mb: 2,
            }}
         >
            {/* Big percent */}
            <Box sx={{ flexShrink: 0 }}>
               <Typography
                  sx={{
                     fontSize: "2.5rem",
                     fontWeight: 800,
                     lineHeight: 1,
                     color: tokens.color.primary[700],
                  }}
               >
                  {summary.progressPercentage}%
               </Typography>
               <Typography
                  variant="caption"
                  sx={{
                     color: tokens.color.text.muted,
                     fontWeight: 600,
                     textTransform: "uppercase",
                     letterSpacing: "0.05em",
                  }}
               >
                  Overall Progress
               </Typography>
            </Box>

            {/* Divider */}
            <Box
               sx={{
                  width: 1,
                  height: 4,
                  backgroundColor: "transparent",
                  display: { xs: "none", sm: "block" },
                  flexShrink: 0,
               }}
            />

            {/* Stat pills */}
            <Box
               sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  alignItems: "center",
               }}
            >
               <Chip
                  icon={
                     <CheckCircleOutlineIcon
                        sx={{
                           fontSize: "16px !important",
                           color: `${tokens.color.primary[700]} !important`,
                        }}
                     />
                  }
                  label={`${summary.completedSteps} Completed`}
                  size="small"
                  sx={{
                     backgroundColor: alpha(tokens.color.primary[700], 0.08),
                     color: tokens.color.primary[700],
                     fontWeight: 600,
                     fontSize: "0.75rem",
                  }}
               />
               {summary.currentStep && (
                  <Chip
                     icon={
                        <AccessTimeOutlinedIcon
                           sx={{
                              fontSize: "16px !important",
                              color: `${tokens.color.primary[500]} !important`,
                           }}
                        />
                     }
                     label="In Progress"
                     size="small"
                     sx={{
                        backgroundColor: alpha(tokens.color.primary[500], 0.08),
                        color: tokens.color.primary[500],
                        fontWeight: 600,
                        fontSize: "0.75rem",
                     }}
                  />
               )}
               {pending > 0 && (
                  <Chip
                     icon={
                        <RadioButtonUncheckedIcon
                           sx={{
                              fontSize: "16px !important",
                              color: `${tokens.color.text.muted} !important`,
                           }}
                        />
                     }
                     label={`${pending} Pending`}
                     size="small"
                     sx={{
                        backgroundColor: alpha(tokens.color.text.muted, 0.08),
                        color: tokens.color.text.muted,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                     }}
                  />
               )}
            </Box>

            {/* Current step (right side) */}
            {summary.currentStep && (
               <Box
                  sx={{
                     ml: "auto",
                     pl: 2,
                     borderLeft: `2px solid ${tokens.color.primary[700]}`,
                     display: { xs: "none", md: "block" },
                  }}
               >
                  <Typography
                     variant="caption"
                     sx={{
                        color: tokens.color.primary[700],
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        display: "block",
                        mb: 0.25,
                     }}
                  >
                     Current Step
                  </Typography>
                  <Typography
                     variant="body2"
                     sx={{ fontWeight: 600, color: tokens.color.text.primary }}
                  >
                     {summary.currentStep.title}
                  </Typography>
               </Box>
            )}
         </Box>

         {/* Progress bar */}
         <LinearProgress
            variant="determinate"
            value={summary.progressPercentage}
            sx={{
               height: 6,
               borderRadius: 3,
               backgroundColor: alpha(tokens.color.primary[700], 0.1),
               "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  backgroundColor: tokens.color.primary[700],
               },
            }}
         />

         {/* Step counter below bar */}
         <Typography
            variant="caption"
            sx={{ color: tokens.color.text.muted, mt: 1, display: "block" }}
         >
            {summary.completedSteps} of {summary.totalSteps} steps completed
         </Typography>
      </Box>
   );
}
