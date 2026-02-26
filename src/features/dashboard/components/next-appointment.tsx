import { Box, Typography, Avatar, Button, Chip, alpha } from "@mui/material";
import { format } from "date-fns";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";
import type { UpcomingAppointment } from "../types";

type NextAppointmentProps = {
   appointment: UpcomingAppointment | null;
};

export function NextAppointment({ appointment }: NextAppointmentProps) {
   const navigate = useNavigate();

   return (
      <Box
         sx={{
            border: `1px solid ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.color.surface,
            p: 2.5,
            height: "100%",
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
               Next Appointment
            </Typography>
            <Button
               size="small"
               endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
               onClick={() => navigate("/appointments")}
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

         {!appointment ? (
            /* Empty state */
            <Box
               sx={{
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
               }}
            >
               <CalendarTodayOutlinedIcon
                  sx={{
                     fontSize: 36,
                     color: tokens.color.text.muted,
                     opacity: 0.5,
                  }}
               />
               <Typography
                  variant="body2"
                  sx={{ color: tokens.color.text.muted, textAlign: "center" }}
               >
                  No upcoming appointments
               </Typography>
               <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate("/appointments")}
                  sx={{
                     mt: 0.5,
                     textTransform: "none",
                     fontSize: "0.75rem",
                     fontWeight: 600,
                     borderRadius: `${tokens.radius.control}px`,
                     borderColor: tokens.color.primary[700],
                     color: tokens.color.primary[700],
                  }}
               >
                  Book appointment
               </Button>
            </Box>
         ) : (
            /* Appointment card */
            <Box
               sx={{
                  p: 1.5,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1px solid ${tokens.color.border}`,
                  backgroundColor: alpha(tokens.color.primary[700], 0.02),
               }}
            >
               {/* Advisor row */}
               <Box
                  sx={{
                     display: "flex",
                     gap: 1.5,
                     alignItems: "flex-start",
                     mb: 1.5,
                  }}
               >
                  <Avatar
                     sx={{
                        width: 40,
                        height: 40,
                        bgcolor: tokens.color.primary[700],
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        borderRadius: `${tokens.radius.control}px`,
                     }}
                  >
                     {appointment.advisorName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                     <Typography
                        variant="body2"
                        sx={{
                           fontWeight: 700,
                           color: tokens.color.text.primary,
                           mb: 0.25,
                        }}
                     >
                        {appointment.advisorName}
                     </Typography>
                     {appointment.advisorRole && (
                        <Typography
                           variant="caption"
                           sx={{
                              color: tokens.color.text.secondary,
                              fontSize: "0.75rem",
                           }}
                        >
                           {appointment.advisorRole}
                        </Typography>
                     )}
                  </Box>
                  {appointment.type && (
                     <Chip
                        label={appointment.type}
                        size="small"
                        sx={{
                           height: 20,
                           fontSize: "0.6875rem",
                           fontWeight: 600,
                           backgroundColor:
                              appointment.type === "Online"
                                 ? alpha(tokens.color.info, 0.1)
                                 : alpha(tokens.color.success, 0.1),
                           color:
                              appointment.type === "Online"
                                 ? tokens.color.info
                                 : tokens.color.success,
                           "& .MuiChip-label": { px: 1 },
                        }}
                     />
                  )}
               </Box>

               {/* Date / time row */}
               <Box
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     gap: 0.75,
                     mb: 1.5,
                  }}
               >
                  <Box
                     sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                     <CalendarTodayOutlinedIcon
                        sx={{ fontSize: 14, color: tokens.color.text.muted }}
                     />
                     <Typography
                        variant="caption"
                        sx={{
                           color: tokens.color.text.secondary,
                           fontSize: "0.75rem",
                        }}
                     >
                        {format(appointment.date, "EEEE, MMM d, yyyy")}
                     </Typography>
                  </Box>
                  <Box
                     sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                     <AccessTimeOutlinedIcon
                        sx={{ fontSize: 14, color: tokens.color.text.muted }}
                     />
                     <Typography
                        variant="caption"
                        sx={{
                           color: tokens.color.text.secondary,
                           fontSize: "0.75rem",
                        }}
                     >
                        {format(appointment.date, "h:mm a")} ·{" "}
                        {appointment.duration} min
                     </Typography>
                  </Box>
                  {appointment.locationOrLink && (
                     <Box
                        sx={{
                           display: "flex",
                           alignItems: "center",
                           gap: 0.75,
                        }}
                     >
                        <LocationOnOutlinedIcon
                           sx={{ fontSize: 14, color: tokens.color.text.muted }}
                        />
                        <Typography
                           variant="caption"
                           sx={{
                              color: tokens.color.text.secondary,
                              fontSize: "0.75rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                           }}
                        >
                           {appointment.locationOrLink}
                        </Typography>
                     </Box>
                  )}
               </Box>

               {/* Join button — only for Online */}
               {appointment.meetingLink && (
                  <Button
                     variant="contained"
                     fullWidth
                     size="small"
                     startIcon={<VideocamOutlinedIcon sx={{ fontSize: 16 }} />}
                     href={appointment.meetingLink}
                     target="_blank"
                     sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        borderRadius: `${tokens.radius.control}px`,
                        backgroundColor: tokens.color.primary[700],
                        boxShadow: "none",
                        "&:hover": {
                           backgroundColor: tokens.color.primary[900],
                           boxShadow: tokens.shadow.sm,
                        },
                     }}
                  >
                     Join Meeting
                  </Button>
               )}
            </Box>
         )}
      </Box>
   );
}
