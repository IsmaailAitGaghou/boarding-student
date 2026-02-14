import {
   Card,
   Stack,
   Typography,
   Box,
   Avatar,
   Button,
   Chip,
} from "@mui/material";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { tokens } from "@/app/theme";
import type { UpcomingAppointment } from "../types";
import { format } from "date-fns";

type AppointmentsWidgetProps = {
   appointments: UpcomingAppointment[];
};

export function AppointmentsWidget({ appointments }: AppointmentsWidgetProps) {
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
            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Upcoming Appointments
               </Typography>
               <Button
                  size="small"
                  sx={{ fontSize: "0.75rem", textTransform: "none" }}
               >
                  View All
               </Button>
            </Box>

            <Stack spacing={2}>
               {appointments.map((appointment) => {
                  const isToday =
                     format(appointment.date, "yyyy-MM-dd") ===
                     format(new Date(), "yyyy-MM-dd");
                  const isTomorrow =
                     format(appointment.date, "yyyy-MM-dd") ===
                     format(
                        new Date(Date.now() + 24 * 60 * 60 * 1000),
                        "yyyy-MM-dd",
                     );

                  return (
                     <Box
                        key={appointment.id}
                        sx={{
                           p: 2,
                           borderRadius: 2,
                           border: `1px solid ${tokens.color.border}`,
                           backgroundColor: isToday
                              ? `${tokens.color.primary[700]}05`
                              : "transparent",
                           transition: "all 0.2s",
                           "&:hover": {
                              boxShadow: tokens.shadow.sm,
                           },
                        }}
                     >
                        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                           <Avatar
                              sx={{
                                 width: 40,
                                 height: 40,
                                 bgcolor: tokens.color.primary[700],
                                 fontSize: "0.875rem",
                              }}
                           >
                              {appointment.advisorName.charAt(0)}
                           </Avatar>
                           <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                 variant="body2"
                                 sx={{ fontWeight: 600, mb: 0.25 }}
                              >
                                 {appointment.advisorName}
                              </Typography>
                              <Typography
                                 variant="caption"
                                 color="text.secondary"
                                 sx={{ display: "block" }}
                              >
                                 {appointment.purpose}
                              </Typography>
                           </Box>
                        </Box>

                        <Stack spacing={1}>
                           <Box
                              sx={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 1,
                                 flexWrap: "wrap",
                              }}
                           >
                              <Chip
                                 label={
                                    isToday
                                       ? "Today"
                                       : isTomorrow
                                       ? "Tomorrow"
                                       : format(
                                            appointment.date,
                                            "MMM dd, yyyy",
                                         )
                                 }
                                 size="small"
                                 sx={{
                                    height: 24,
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    bgcolor: isToday
                                       ? tokens.color.primary[700]
                                       : `${tokens.color.text.secondary}15`,
                                    color: isToday
                                       ? "white"
                                       : tokens.color.text.secondary,
                                 }}
                              />
                              <Box
                                 sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                 }}
                              >
                                 <AccessTimeOutlinedIcon
                                    sx={{
                                       fontSize: 14,
                                       color: tokens.color.text.muted,
                                    }}
                                 />
                                 <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.6875rem" }}
                                 >
                                    {format(appointment.date, "h:mm a")} (
                                    {appointment.duration}
                                    min)
                                 </Typography>
                              </Box>
                           </Box>

                           {appointment.meetingLink && (
                              <Button
                                 size="small"
                                 variant="outlined"
                                 startIcon={
                                    <VideocamOutlinedIcon fontSize="small" />
                                 }
                                 sx={{
                                    borderRadius: 1.5,
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                    borderColor: tokens.color.border,
                                 }}
                              >
                                 Join Meeting
                              </Button>
                           )}
                        </Stack>
                     </Box>
                  );
               })}
            </Stack>
         </Stack>
      </Card>
   );
}
