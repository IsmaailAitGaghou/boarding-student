import { useState } from "react";
import {
   Box,
   Typography,
   Avatar,
   Chip,
   Divider,
   CircularProgress,
   alpha,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { tokens } from "@/app/theme";
import type { Appointment } from "../types";

interface AppointmentCardProps {
   appointment: Appointment;
   onViewDetails: (id: string) => void;
   onReschedule: (id: string) => void;
   onCancel: (id: string) => Promise<void>;
   cancellingId?: string | null;
}

function formatDateTime(iso: string): { date: string; time: string } {
   const d = new Date(iso);
   const date = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
   });
   const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
   });
   return { date, time };
}

const STATUS_CONFIG: Record<
   Appointment["status"],
   { label: string; bg: string; color: string }
> = {
   Scheduled: {
      label: "Scheduled",
      bg: alpha("#0C7779", 0.1),
      color: "#0C7779",
   },
   Completed: {
      label: "Completed",
      bg: alpha("#2563EB", 0.1),
      color: "#2563EB",
   },
   Cancelled: {
      label: "Cancelled",
      bg: alpha("#6B7280", 0.1),
      color: "#6B7280",
   },
};

const TYPE_CONFIG: Record<
   Appointment["type"],
   { icon: React.ReactNode; color: string }
> = {
   Online: {
      icon: <VideocamOutlinedIcon sx={{ fontSize: 13 }} />,
      color: tokens.color.primary[700],
   },
   "On-site": {
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />,
      color: tokens.color.warning,
   },
};

export function AppointmentCard({
   appointment,
   onViewDetails,
   onReschedule,
   onCancel,
   cancellingId,
}: AppointmentCardProps) {
   const [confirmCancel, setConfirmCancel] = useState(false);
   const { date, time } = formatDateTime(appointment.dateTime);
   const statusCfg = STATUS_CONFIG[appointment.status];
   const typeCfg = TYPE_CONFIG[appointment.type];
   const isCancelling = cancellingId === appointment.id;
   const isUpcoming = appointment.status === "Scheduled";

   const initials = appointment.advisorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

   return (
      <Box
         sx={{
            border: `1px solid ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            backgroundColor: tokens.color.surface,
            boxShadow: "none",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": {
               borderColor: alpha(tokens.color.primary[300], 0.3),
               boxShadow: tokens.shadow.sm,
            },
         }}
      >
         {/* Top row: avatar + info + chips */}
         <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Avatar
               sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: alpha(tokens.color.primary[700], 0.12),
                  color: tokens.color.primary[700],
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: `${tokens.radius.control}px`,
                  flexShrink: 0,
               }}
            >
               {initials}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
               <Typography
                  variant="subtitle2"
                  sx={{
                     fontWeight: 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.3,
                  }}
               >
                  {appointment.advisorName}
               </Typography>
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.muted, fontWeight: 500 }}
               >
                  {appointment.advisorRole}
               </Typography>
            </Box>

            {/* Status + type chips */}
            <Box sx={{ display: "flex", gap: 0.75, flexShrink: 0 }}>
               <Chip
                  label={statusCfg.label}
                  size="small"
                  sx={{
                     height: 22,
                     fontSize: "0.7rem",
                     fontWeight: 700,
                     borderRadius: `${tokens.radius.control}px`,
                     backgroundColor: statusCfg.bg,
                     color: statusCfg.color,
                  }}
               />
               <Chip
                  icon={
                     <Box
                        sx={{
                           color: typeCfg.color,
                           display: "flex",
                           ml: "6px !important",
                        }}
                     >
                        {typeCfg.icon}
                     </Box>
                  }
                  label={appointment.type}
                  size="small"
                  sx={{
                     height: 22,
                     fontSize: "0.7rem",
                     fontWeight: 700,
                     borderRadius: `${tokens.radius.control}px`,
                     backgroundColor: alpha(typeCfg.color, 0.08),
                     color: typeCfg.color,
                  }}
               />
            </Box>
         </Box>

         {/* Date / time / duration row */}
         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.secondary }}
               >
                  {date}
               </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               <AccessTimeIcon
                  sx={{ fontSize: 14, color: tokens.color.text.muted }}
               />
               <Typography
                  variant="caption"
                  sx={{ color: tokens.color.text.secondary }}
               >
                  {time} · {appointment.duration} min
               </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
               {typeCfg.icon}
               <Typography
                  variant="caption"
                  sx={{
                     color: tokens.color.text.muted,
                     maxWidth: 240,
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     whiteSpace: "nowrap",
                  }}
               >
                  {appointment.locationOrLink}
               </Typography>
            </Box>
         </Box>

         {/* Notes preview */}
         {appointment.notes && (
            <Typography
               variant="body2"
               sx={{
                  color: tokens.color.text.muted,
                  fontSize: "0.78rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                  fontStyle: "italic",
               }}
            >
               "{appointment.notes}"
            </Typography>
         )}

         <Divider sx={{ borderColor: tokens.color.border }} />

         {/* Actions */}
         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* View Details — always visible */}
            <ActionBtn
               label="View details"
               variant="outlined"
               onClick={() => onViewDetails(appointment.id)}
            />

            {isUpcoming && (
               <>
                  <ActionBtn
                     label="Reschedule"
                     variant="text"
                     onClick={() => onReschedule(appointment.id)}
                  />
                  {confirmCancel ? (
                     <>
                        <Typography
                           variant="caption"
                           sx={{ color: tokens.color.error, fontWeight: 600 }}
                        >
                           Sure?
                        </Typography>
                        <ActionBtn
                           label={isCancelling ? "" : "Yes, cancel"}
                           variant="danger"
                           onClick={async () => {
                              await onCancel(appointment.id);
                              setConfirmCancel(false);
                           }}
                           loading={isCancelling}
                        />
                        <ActionBtn
                           label="No"
                           variant="text"
                           onClick={() => setConfirmCancel(false)}
                        />
                     </>
                  ) : (
                     <ActionBtn
                        label="Cancel"
                        variant="text"
                        danger
                        onClick={() => setConfirmCancel(true)}
                     />
                  )}
               </>
            )}
         </Box>
      </Box>
   );
}

// ── Tiny button helper ────────────────────────────────────────────────────────
function ActionBtn({
   label,
   variant,
   onClick,
   loading,
   danger,
}: {
   label: string;
   variant: "outlined" | "text" | "danger";
   onClick: () => void | Promise<void>;
   loading?: boolean;
   danger?: boolean;
}) {
   const color =
      variant === "danger" || danger
         ? tokens.color.error
         : tokens.color.primary[700];

   const bg =
      variant === "outlined"
         ? "transparent"
         : variant === "danger"
         ? alpha(tokens.color.error, 0.06)
         : "transparent";

   return (
      <Box
         component="button"
         onClick={onClick}
         disabled={loading}
         sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            py: 0.625,
            px: 1.25,
            borderRadius: `${tokens.radius.control}px`,
            border:
               variant === "outlined"
                  ? `1.5px solid ${tokens.color.primary[700]}`
                  : "none",
            backgroundColor: bg,
            color,
            fontWeight: 700,
            fontSize: "0.75rem",
            cursor: loading ? "default" : "pointer",
            whiteSpace: "nowrap",
            transition: "background-color 0.15s, border-color 0.15s",
            "&:hover:not(:disabled)": {
               backgroundColor:
                  variant === "outlined"
                     ? alpha(tokens.color.primary[700], 0.06)
                     : alpha(color, 0.06),
            },
         }}
      >
         {loading ? <CircularProgress size={12} sx={{ color }} /> : label}
      </Box>
   );
}
