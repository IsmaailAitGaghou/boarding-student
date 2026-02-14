import { Card, Box, Typography, Avatar, Button } from "@mui/material";
import { format } from "date-fns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";
import type { UpcomingAppointment } from "../types";

type NextAppointmentProps = {
   appointment: UpcomingAppointment | null;
};

export function NextAppointment({ appointment }: NextAppointmentProps) {
    const navigate = useNavigate();
   if (!appointment) {
      return (
         <Card
            sx={{
               p: 3,
               borderRadius: 2,
               boxShadow: "none",
               border: `1px solid ${tokens.color.border}`,
               textAlign: "center",
            }}
         >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
               Upcoming Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary">
               No upcoming appointments scheduled
            </Typography>
         </Card>
      );
   }

   return (
      <Card
         sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
         <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Next Appointment
         </Typography>
         <Button
                           size="small"
                           endIcon={<ArrowForwardIcon />}
                           onClick={() => {
                              navigate("/appointments");
                           }}
                           sx={{
                              p: 2,
                              borderColor: tokens.color.border,
                              color: tokens.color.text.primary,
                              "&:hover": {
                                 borderColor: tokens.color.primary[700],
                                 backgroundColor: tokens.color.primary[300] + "10",
                              },
                           }}
                        >
                           View All
                        </Button>
                        </Box>

         <Box
            sx={{
               borderRadius: 2,
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
               <Avatar
                  src={appointment.advisorAvatar}
                  alt={appointment.advisorName}
                  sx={{ width: 48, height: 48 }}
               >
                  {appointment.advisorName.charAt(0)}
               </Avatar>
               <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                     {appointment.advisorName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     {appointment.purpose}
                  </Typography>
               </Box>
            </Box>

            <Box
               sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
            >
               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon
                     sx={{ fontSize: 16, color: tokens.color.text.muted }}
                  />
                  <Typography variant="body2" color="text.secondary">
                     {format(appointment.date, "EEEE, MMMM d, yyyy")}
                  </Typography>
               </Box>
               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon
                     sx={{ fontSize: 16, color: tokens.color.text.muted }}
                  />
                  <Typography variant="body2" color="text.secondary">
                     {format(appointment.date, "h:mm a")} •{" "}
                     {appointment.duration} min
                  </Typography>
               </Box>
            </Box>

            {appointment.meetingLink && (
               <Button
                  variant="contained"
                  fullWidth
                  startIcon={<VideocamIcon />}
                  sx={{
                     backgroundColor: tokens.color.primary[700],
                     "&:hover": {
                        backgroundColor: tokens.color.primary[900],
                     },
                  }}
               >
                  Join Meeting
               </Button>
            )}
         </Box>
      </Card>
   );
}
