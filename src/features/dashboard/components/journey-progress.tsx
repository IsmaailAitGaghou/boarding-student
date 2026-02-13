import {
   Card,
   Stack,
   Typography,
   Stepper,
   Step,
   StepLabel,
   StepConnector,
   stepConnectorClasses,
   styled,
   Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { tokens } from "@/app/theme";
import type { JourneyStage } from "../types";

type JourneyProgressProps = {
   stages: JourneyStage[];
};

const CustomConnector = styled(StepConnector)(({ theme }) => ({
   [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 12px)",
      right: "calc(50% + 12px)",
   },
   [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: tokens.color.border,
      borderRadius: 1,
   },
   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
      backgroundColor: tokens.color.primary[700],
   },
   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
      backgroundColor: tokens.color.primary[700],
   },
}));

export function JourneyProgress({ stages }: JourneyProgressProps) {
   const activeStep = stages.findIndex((stage) => stage.current);
   const completedCount = stages.filter((stage) => stage.completed).length;
   const progressPercentage = Math.round(
      (completedCount / stages.length) * 100,
   );

   return (
      <Card
         sx={{
            p: 3,
            height: "100%",
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Stack spacing={3}>
            <Box>
               <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Your Journey Progress
               </Typography>
               <Typography variant="body2" color="text.secondary">
                  {completedCount} of {stages.length} stages completed (
                  {progressPercentage}
                  %)
               </Typography>
            </Box>

            <Stepper
               activeStep={activeStep}
               alternativeLabel
               connector={<CustomConnector />}
            >
               {stages.map((stage) => (
                  <Step key={stage.id} completed={stage.completed}>
                     <StepLabel
                        StepIconComponent={({ active, completed }) => (
                           <Box
                              sx={{
                                 width: 24,
                                 height: 24,
                                 borderRadius: "50%",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 backgroundColor: completed
                                    ? tokens.color.primary[700]
                                    : active
                                    ? tokens.color.primary[300]
                                    : tokens.color.border,
                                 color:
                                    completed || active
                                       ? "white"
                                       : tokens.color.text.muted,
                              }}
                           >
                              {completed ? (
                                 <CheckCircleIcon
                                    sx={{
                                       fontSize: 24,
                                       color: tokens.color.primary[700],
                                    }}
                                 />
                              ) : (
                                 <RadioButtonUncheckedIcon
                                    sx={{
                                       fontSize: 24,
                                       color: active
                                          ? tokens.color.primary[700]
                                          : tokens.color.text.muted,
                                    }}
                                 />
                              )}
                           </Box>
                        )}
                        sx={{
                           "& .MuiStepLabel-label": {
                              fontSize: "0.75rem",
                              fontWeight: stage.current ? 600 : 400,
                              color: stage.completed
                                 ? tokens.color.text.primary
                                 : stage.current
                                 ? tokens.color.primary[700]
                                 : tokens.color.text.muted,
                              mt: 1,
                           },
                        }}
                     >
                        {stage.label}
                     </StepLabel>
                  </Step>
               ))}
            </Stepper>
         </Stack>
      </Card>
   );
}
