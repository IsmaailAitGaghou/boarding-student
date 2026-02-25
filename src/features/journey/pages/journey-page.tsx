import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Alert, Button, Divider, alpha } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getJourneyData } from "../api";
import { JourneySummaryCard, JourneyStepCard } from "../components";
import { Loading } from "@/shared/components/loading";
import { tokens } from "@/app/theme";
import type { JourneyData } from "../types";

export function JourneyPage() {
   const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const loadJourney = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await getJourneyData();
         setJourneyData(data);
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Failed to load journey data. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      loadJourney();
   }, [loadJourney]);

   const scrollToCurrentStep = () => {
      if (journeyData?.summary.currentStep) {
         const el = document.getElementById(
            `step-${journeyData.summary.currentStep.id}`,
         );
         el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
   };

   /*  Loading state  */
   if (loading) {
      return <Loading variant="section" minHeight={480} />;
   }

   /*  Full-page error (no data at all)  */
   if (error && !journeyData) {
      return (
         <Box sx={{ maxWidth: 760, mx: "auto", pt: 6, textAlign: "center" }}>
            <Alert
               severity="error"
               action={
                  <Button
                     color="error"
                     size="small"
                     startIcon={<RefreshIcon />}
                     onClick={loadJourney}
                  >
                     Retry
                  </Button>
               }
            >
               {error}
            </Alert>
         </Box>
      );
   }

   if (!journeyData) return null;

   const { summary, steps } = journeyData;

   const nextPendingSteps = steps
      .filter((s) => s.status === "pending")
      .slice(0, 3);

   return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
         {/* Page header */}
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
               flexWrap: "wrap",
               gap: 2,
               mb: 3,
            }}
         >
            <Box>
               <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Journey Tracking
               </Typography>
               <Typography variant="body2" color="text.secondary">
                  Follow your placement journey from profile creation to on-site
                  integration
               </Typography>
            </Box>

            {/* Scroll-to-current CTA */}
            {summary.currentStep && (
               <Button
                  size="small"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={scrollToCurrentStep}
                  sx={{
                     backgroundColor: tokens.color.primary[700],
                     fontWeight: 600,
                     px: 3,
                     "&:hover": {
                        backgroundColor: tokens.color.primary[900],
                     },
                  }}
               >
                  Go to current step
               </Button>
            )}
         </Box>

         {/* Inline error banner (data still shown) */}
         {error && (
            <Alert
               severity="error"
               sx={{ mb: 3 }}
               onClose={() => setError(null)}
            >
               {error}
            </Alert>
         )}

         {/* Progress summary bar */}
         <Box sx={{ mb: 4 }}>
            <JourneySummaryCard summary={summary} />
         </Box>

         {/* Main content: timeline + side panel */}
         <Box
            sx={{
               display: "flex",
               gap: 3,
               alignItems: "flex-start",
            }}
         >
            {/* Timeline column */}
            <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 1,
                     mb: 3,
                  }}
               >
                  <RouteOutlinedIcon
                     sx={{ fontSize: 20, color: tokens.color.primary[700] }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                     Your Roadmap
                  </Typography>
                  <Typography
                     variant="caption"
                     sx={{
                        ml: 0.5,
                        color: tokens.color.text.muted,
                        fontWeight: 600,
                     }}
                  >
                     {steps.length} steps
                  </Typography>
               </Box>

               {steps.length === 0 ? (
                  <Alert severity="info">
                     No journey steps found. Your journey will begin once you
                     complete your profile setup.
                  </Alert>
               ) : (
                  <Box>
                     {steps.map((step, index) => (
                        <div key={step.id} id={`step-${step.id}`}>
                           <JourneyStepCard
                              step={step}
                              stepNumber={index + 1}
                              isLast={index === steps.length - 1}
                           />
                        </div>
                     ))}
                  </Box>
               )}
            </Box>

            {/* Side panel */}
            <Box
               sx={{
                  width: 260,
                  flexShrink: 0,
                  display: { xs: "none", lg: "flex" },
                  flexDirection: "column",
                  gap: 2,
                  position: "sticky",
                  top: 80,
               }}
            >
               {/* Current step card */}
               {summary.currentStep && (
                  <Box
                     sx={{
                        p: 2.5,
                        borderRadius: `${tokens.radius.card}px`,
                        border: `1.5px solid ${tokens.color.primary[700]}`,
                        backgroundColor: alpha(tokens.color.primary[700], 0.03),
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
                           mb: 1,
                        }}
                     >
                        In Progress
                     </Typography>
                     <Typography
                        variant="body2"
                        sx={{
                           fontWeight: 700,
                           color: tokens.color.text.primary,
                           mb: 0.5,
                        }}
                     >
                        {summary.currentStep.title}
                     </Typography>
                     <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1.5, lineHeight: 1.5 }}
                     >
                        {summary.currentStep.description.slice(0, 90)}
                        {summary.currentStep.description.length > 90
                           ? "..."
                           : ""}
                     </Typography>
                     <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        onClick={scrollToCurrentStep}
                        sx={{
                           backgroundColor: tokens.color.primary[700],
                           fontWeight: 600,
                           "&:hover": {
                              backgroundColor: tokens.color.primary[900],
                           },
                        }}
                     >
                        View Details
                     </Button>
                  </Box>
               )}

               {/* Up next */}
               {nextPendingSteps.length > 0 && (
                  <Box
                     sx={{
                        p: 2.5,
                        borderRadius: `${tokens.radius.card}px`,
                        border: `1px solid ${tokens.color.border}`,
                        backgroundColor: "background.paper",
                     }}
                  >
                     <Typography
                        variant="caption"
                        sx={{
                           fontWeight: 700,
                           textTransform: "uppercase",
                           letterSpacing: "0.05em",
                           color: tokens.color.text.muted,
                           display: "block",
                           mb: 1.5,
                        }}
                     >
                        Up Next
                     </Typography>
                     <Box
                        sx={{
                           display: "flex",
                           flexDirection: "column",
                           gap: 0,
                        }}
                     >
                        {nextPendingSteps.map((step, idx) => (
                           <Box key={step.id}>
                              {idx > 0 && (
                                 <Divider
                                    sx={{
                                       borderColor: tokens.color.border,
                                       my: 1,
                                    }}
                                 />
                              )}
                              <Typography
                                 variant="body2"
                                 sx={{
                                    fontWeight: 600,
                                    color: tokens.color.text.secondary,
                                    fontSize: "0.8125rem",
                                 }}
                              >
                                 {step.title}
                              </Typography>
                           </Box>
                        ))}
                     </Box>
                  </Box>
               )}
            </Box>
         </Box>
      </Box>
   );
}
