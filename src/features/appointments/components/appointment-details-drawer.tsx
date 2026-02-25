import {
   Box,
   Drawer,
   Typography,
   Avatar,
   Chip,
   Divider,
   IconButton,
   alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import NotesIcon from "@mui/icons-material/Notes";
import { tokens } from "@/app/theme";
import type { Appointment } from "../types";

interface AppointmentDetailsDrawerProps {
   appointment: Appointment | null;
   open: boolean;
   onClose: () => void;
   onReschedule?: (id: string) => void;
   onCancel?: (id: string) => Promise<void>;
}

function formatDateTime(iso: string) {
   const d = new Date(iso);
   return {
      date: d.toLocaleDateString("en-US", {
         weekday: "long",
         month: "long",
         day: "numeric",
         year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
      }),
   };
}

const STATUS_COLOR: Record<Appointment["status"], string> = {
   Scheduled: tokens.color.success,
   Completed: tokens.color.info,
   Cancelled: tokens.color.text.muted,
};

export function AppointmentDetailsDrawer({
   appointment,
   open,
   onClose,
   onReschedule,
   onCancel,
}: AppointmentDetailsDrawerProps) {
   if (!appointment) return null;

   const { date, time } = formatDateTime(appointment.dateTime);
   const statusColor = STATUS_COLOR[appointment.status];
   const isOnline = appointment.type === "Online";
   const isUpcoming = appointment.status === "Scheduled";
   const initials = appointment.advisorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

   function handleAddToCalendar() {
      // Mock: in production this would generate an .ics file or open Google Calendar
      alert("Add to Calendar — coming soon!");
   }

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         PaperProps={{
            sx: {
               width: { xs: "100%", sm: 460 },
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
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {initials}
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
                  {appointment.advisorName}
               </Typography>
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.muted,
                     fontWeight: 500,
                     mt: 0.25,
                  }}
               >
                  {appointment.advisorRole}
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

         {/* Status + type banner */}
         <Box
            sx={{
               px: 2.5,
               py: 1.5,
               borderBottom: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 1.5,
               alignItems: "center",
            }}
         >
            <Chip
               label={appointment.status}
               size="small"
               sx={{
                  height: 24,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: `${tokens.radius.control}px`,
                  backgroundColor: alpha(statusColor, 0.1),
                  color: statusColor,
               }}
            />
            <Chip
               icon={
                  isOnline ? (
                     <VideocamOutlinedIcon
                        sx={{ fontSize: 13, ml: "6px !important" }}
                     />
                  ) : (
                     <LocationOnOutlinedIcon
                        sx={{ fontSize: 13, ml: "6px !important" }}
                     />
                  )
               }
               label={appointment.type}
               size="small"
               sx={{
                  height: 24,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: `${tokens.radius.control}px`,
                  backgroundColor: isOnline
                     ? alpha(tokens.color.primary[700], 0.08)
                     : alpha(tokens.color.warning, 0.08),
                  color: isOnline
                     ? tokens.color.primary[700]
                     : tokens.color.warning,
               }}
            />
         </Box>

         {/* Scrollable body */}
         <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5 }}>
            {/* Date & time */}
            <DetailRow
               icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />}
               label="Date"
               value={date}
            />
            <DetailRow
               icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
               label="Time & duration"
               value={`${time} · ${appointment.duration} minutes`}
            />
            <DetailRow
               icon={
                  isOnline ? (
                     <VideocamOutlinedIcon sx={{ fontSize: 16 }} />
                  ) : (
                     <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                  )
               }
               label={isOnline ? "Meeting link" : "Location"}
               value={appointment.locationOrLink}
               isLink={isOnline}
            />

            {appointment.notes && (
               <>
                  <Divider sx={{ borderColor: tokens.color.border, my: 2 }} />
                  <Box
                     sx={{
                        display: "flex",
                        gap: 1.25,
                        alignItems: "flex-start",
                     }}
                  >
                     <Box
                        sx={{
                           color: tokens.color.text.muted,
                           mt: "2px",
                           flexShrink: 0,
                        }}
                     >
                        <NotesIcon sx={{ fontSize: 16 }} />
                     </Box>
                     <Box>
                        <Typography
                           variant="caption"
                           sx={{
                              display: "block",
                              mb: 0.5,
                              fontWeight: 700,
                              color: tokens.color.text.muted,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              fontSize: "0.68rem",
                           }}
                        >
                           Notes
                        </Typography>
                        <Typography
                           variant="body2"
                           sx={{
                              color: tokens.color.text.secondary,
                              lineHeight: 1.65,
                              fontSize: "0.83rem",
                           }}
                        >
                           {appointment.notes}
                        </Typography>
                     </Box>
                  </Box>
               </>
            )}
         </Box>

         {/* Footer actions */}
         <Box
            sx={{
               px: 2.5,
               py: 2,
               borderTop: `1px solid ${tokens.color.border}`,
               display: "flex",
               gap: 1.25,
               flexWrap: "wrap",
            }}
         >
            {/* Add to calendar — always shown */}
            <Box
               component="button"
               onClick={handleAddToCalendar}
               sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  py: 0.875,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${tokens.color.border}`,
                  backgroundColor: "transparent",
                  color: tokens.color.text.secondary,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background-color 0.15s",
                  "&:hover": {
                     borderColor: tokens.color.primary[700],
                     color: tokens.color.primary[700],
                     backgroundColor: alpha(tokens.color.primary[700], 0.04),
                  },
               }}
            >
               <EventAvailableIcon sx={{ fontSize: 16 }} />
               Add to calendar
            </Box>

            {/* Reschedule — upcoming only */}
            {isUpcoming && onReschedule && (
               <Box
                  component="button"
                  onClick={() => {
                     onReschedule(appointment.id);
                     onClose();
                  }}
                  sx={{
                     flex: 1,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     py: 0.875,
                     borderRadius: `${tokens.radius.control}px`,
                     border: `1.5px solid ${tokens.color.primary[700]}`,
                     backgroundColor: "transparent",
                     color: tokens.color.primary[700],
                     fontWeight: 700,
                     fontSize: "0.82rem",
                     cursor: "pointer",
                     transition: "background-color 0.15s",
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.primary[700], 0.06),
                     },
                  }}
               >
                  Reschedule
               </Box>
            )}

            {/* Cancel — upcoming only */}
            {isUpcoming && onCancel && (
               <Box
                  component="button"
                  onClick={async () => {
                     await onCancel(appointment.id);
                     onClose();
                  }}
                  sx={{
                     flex: 1,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     py: 0.875,
                     borderRadius: `${tokens.radius.control}px`,
                     border: `1.5px solid ${tokens.color.error}`,
                     backgroundColor: alpha(tokens.color.error, 0.04),
                     color: tokens.color.error,
                     fontWeight: 700,
                     fontSize: "0.82rem",
                     cursor: "pointer",
                     transition: "background-color 0.15s",
                     "&:hover": {
                        backgroundColor: alpha(tokens.color.error, 0.08),
                     },
                  }}
               >
                  Cancel appointment
               </Box>
            )}
         </Box>
      </Drawer>
   );
}

// ── Row helper ────────────────────────────────────────────────────────────────
function DetailRow({
   icon,
   label,
   value,
   isLink,
}: {
   icon: React.ReactNode;
   label: string;
   value: string;
   isLink?: boolean;
}) {
   return (
      <Box
         sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "flex-start",
            mb: 1.75,
         }}
      >
         <Box sx={{ color: tokens.color.text.muted, mt: "2px", flexShrink: 0 }}>
            {icon}
         </Box>
         <Box>
            <Typography
               variant="caption"
               sx={{
                  display: "block",
                  mb: 0.25,
                  fontWeight: 700,
                  color: tokens.color.text.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.68rem",
               }}
            >
               {label}
            </Typography>
            {isLink ? (
               <Typography
                  component="a"
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                     fontSize: "0.83rem",
                     color: tokens.color.primary[700],
                     fontWeight: 600,
                     textDecoration: "underline",
                     wordBreak: "break-all",
                  }}
               >
                  {value}
               </Typography>
            ) : (
               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.secondary,
                     fontSize: "0.83rem",
                     lineHeight: 1.55,
                  }}
               >
                  {value}
               </Typography>
            )}
         </Box>
      </Box>
   );
}
