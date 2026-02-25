import { useState, useCallback } from "react";
import {
   Box,
   Typography,
   Alert,
   Button,
   Tabs,
   Tab,
   Snackbar,
   alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { tokens } from "@/app/theme";
import { Loading } from "@/shared/components/loading";
import {
   getAppointments,
   bookAppointment,
   rescheduleAppointment,
   cancelAppointment,
   isUpcoming,
   isPast,
} from "../api";
import type {
   Appointment,
   AppointmentTab,
   BookingPayload,
   ReschedulePayload,
} from "../types";
import { AppointmentCard } from "../components/appointment-card";
import { AppointmentDetailsDrawer } from "../components/appointment-details-drawer";
import { BookAppointmentDialog } from "../components/book-appointment-dialog";
import { RescheduleDialog } from "../components/reschedule-dialog";
import { useEffect } from "react";

export function AppointmentsPage() {
   const [appointments, setAppointments] = useState<Appointment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [activeTab, setActiveTab] = useState<AppointmentTab>("upcoming");
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [rescheduleId, setRescheduleId] = useState<string | null>(null);
   const [bookingOpen, setBookingOpen] = useState(false);

   const [cancellingId, setCancellingId] = useState<string | null>(null);
   const [bookingSubmitting, setBookingSubmitting] = useState(false);
   const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

   const [toast, setToast] = useState<{ open: boolean; message: string }>({
      open: false,
      message: "",
   });

   const loadAppointments = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const data = await getAppointments();
         setAppointments(data);
      } catch {
         setError("Failed to load appointments. Please try again.");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      void loadAppointments();
   }, [loadAppointments]);

   // ── Derived lists ──────────────────────────────────────────────────────────
   const upcomingList = appointments.filter(isUpcoming);
   const pastList = appointments.filter(isPast);
   const visibleList =
      activeTab === "upcoming"
         ? upcomingList
         : activeTab === "past"
         ? pastList
         : appointments;

   const selectedAppointment =
      appointments.find((a) => a.id === selectedId) ?? null;

   // ── Handlers ───────────────────────────────────────────────────────────────
   function showToast(message: string) {
      setToast({ open: true, message });
   }

   async function handleBook(payload: BookingPayload) {
      setBookingSubmitting(true);
      try {
         const newApt = await bookAppointment(payload);
         setAppointments((prev) => [newApt, ...prev]);
         setBookingOpen(false);
         showToast("Appointment booked successfully!");
      } catch {
         showToast("Failed to book appointment. Please try again.");
      } finally {
         setBookingSubmitting(false);
      }
   }

   async function handleReschedule(id: string, payload: ReschedulePayload) {
      setRescheduleSubmitting(true);
      try {
         const updated = await rescheduleAppointment(id, payload);
         setAppointments((prev) =>
            prev.map((a) => (a.id === id ? updated : a)),
         );
         setRescheduleId(null);
         showToast("Appointment rescheduled successfully!");
      } catch {
         showToast("Failed to reschedule. Please try again.");
      } finally {
         setRescheduleSubmitting(false);
      }
   }

   async function handleCancel(id: string) {
      setCancellingId(id);
      try {
         const updated = await cancelAppointment(id);
         setAppointments((prev) =>
            prev.map((a) => (a.id === id ? updated : a)),
         );
         // Close drawer if the cancelled appointment was open
         if (selectedId === id) setSelectedId(null);
         showToast("Appointment cancelled.");
      } catch {
         showToast("Failed to cancel. Please try again.");
      } finally {
         setCancellingId(null);
      }
   }

   
   return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
         {/* Page header */}
         <Box
            sx={{
               display: "flex",
               alignItems: "flex-start",
               justifyContent: "space-between",
               gap: 2,
               mb: 3,
               flexWrap: "wrap",
            }}
         >
            <Box>
               <Typography
                  variant="h5"
                  sx={{
                     fontWeight: 800,
                     color: tokens.color.text.primary,
                     mb: 0.5,
                  }}
               >
                  Appointments
               </Typography>
               <Typography
                  variant="body2"
                  sx={{ color: tokens.color.text.muted, fontWeight: 500 }}
               >
                  Manage your advisor sessions — upcoming, past, and cancelled.
               </Typography>
            </Box>

            <Box
               component="button"
               onClick={() => setBookingOpen(true)}
               sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  py: 1,
                  px: 2,
                  borderRadius: `${tokens.radius.control}px`,
                  border: "none",
                  backgroundColor: tokens.color.primary[700],
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background-color 0.15s",
                  "&:hover": { backgroundColor: tokens.color.primary[900] },
               }}
            >
               <AddIcon sx={{ fontSize: 18 }} />
               Book appointment
            </Box>
         </Box>

         {/* Summary stat chips */}
         {!loading && !error && (
            <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
               <StatChip
                  icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 15 }} />}
                  label="Upcoming"
                  value={upcomingList.length}
                  color={tokens.color.primary[700]}
               />
               <StatChip
                  label="Completed"
                  value={
                     appointments.filter((a) => a.status === "Completed").length
                  }
                  color={tokens.color.info}
               />
               <StatChip
                  label="Cancelled"
                  value={
                     appointments.filter((a) => a.status === "Cancelled").length
                  }
                  color={tokens.color.text.muted}
               />
            </Box>
         )}

         {/* Tabs */}
         <Box
            sx={{
               borderBottom: `1px solid ${tokens.color.border}`,
               mb: 3,
            }}
         >
            <Tabs
               value={activeTab}
               onChange={(_, v: AppointmentTab) => setActiveTab(v)}
               sx={{
                  minHeight: 40,
                  "& .MuiTab-root": {
                     minHeight: 40,
                     fontWeight: 700,
                     fontSize: "0.85rem",
                     textTransform: "none",
                     color: tokens.color.text.muted,
                     "&.Mui-selected": { color: tokens.color.primary[700] },
                  },
                  "& .MuiTabs-indicator": {
                     backgroundColor: tokens.color.primary[700],
                     height: 2.5,
                  },
               }}
            >
               <Tab
                  label={`Upcoming (${upcomingList.length})`}
                  value="upcoming"
               />
               <Tab label={`Past (${pastList.length})`} value="past" />
               <Tab label={`All (${appointments.length})`} value="all" />
            </Tabs>
         </Box>

         {/* Content */}
         {loading ? (
            <Loading variant="section" minHeight={360} />
         ) : error ? (
            <Alert
               severity="error"
               action={
                  <Button
                     size="small"
                     onClick={() => void loadAppointments()}
                     sx={{ fontWeight: 700 }}
                  >
                     Retry
                  </Button>
               }
               sx={{ borderRadius: `${tokens.radius.card}px` }}
            >
               {error}
            </Alert>
         ) : visibleList.length === 0 ? (
            <EmptyState tab={activeTab} onBook={() => setBookingOpen(true)} />
         ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
               {visibleList.map((apt) => (
                  <AppointmentCard
                     key={apt.id}
                     appointment={apt}
                     onViewDetails={(id) => setSelectedId(id)}
                     onReschedule={(id) => setRescheduleId(id)}
                     onCancel={handleCancel}
                     cancellingId={cancellingId}
                  />
               ))}
            </Box>
         )}

         {/* Details drawer */}
         <AppointmentDetailsDrawer
            appointment={selectedAppointment}
            open={selectedId !== null}
            onClose={() => setSelectedId(null)}
            onReschedule={(id) => {
               setRescheduleId(id);
            }}
            onCancel={handleCancel}
         />

         {/* Book dialog */}
         <BookAppointmentDialog
            open={bookingOpen}
            onClose={() => setBookingOpen(false)}
            onSubmit={handleBook}
            submitting={bookingSubmitting}
         />

         {/* Reschedule dialog */}
         <RescheduleDialog
            open={rescheduleId !== null}
            appointmentId={rescheduleId}
            onClose={() => setRescheduleId(null)}
            onSubmit={handleReschedule}
            submitting={rescheduleSubmitting}
         />

         {/* Toast */}
         <Snackbar
            open={toast.open}
            autoHideDuration={3500}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            message={toast.message}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            ContentProps={{
               sx: {
                  borderRadius: `${tokens.radius.control}px`,
                  fontWeight: 600,
                  backgroundColor: tokens.color.primary[900],
               },
            }}
         />
      </Box>
   );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({
   tab,
   onBook,
}: {
   tab: AppointmentTab;
   onBook: () => void;
}) {
   const messages: Record<AppointmentTab, { title: string; body: string }> = {
      upcoming: {
         title: "No upcoming appointments",
         body: "You don't have any scheduled appointments yet. Book a session with an advisor to get started.",
      },
      past: {
         title: "No past appointments",
         body: "Your completed and cancelled appointments will appear here.",
      },
      all: {
         title: "No appointments yet",
         body: "Book your first session with an advisor.",
      },
   };
   const msg = messages[tab];

   return (
      <Box
         sx={{
            border: `1px dashed ${tokens.color.border}`,
            borderRadius: `${tokens.radius.card}px`,
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
         }}
      >
         <CalendarMonthOutlinedIcon
            sx={{ fontSize: 48, color: tokens.color.text.muted, opacity: 0.45 }}
         />
         <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: tokens.color.text.secondary }}
         >
            {msg.title}
         </Typography>
         <Typography
            variant="body2"
            sx={{
               color: tokens.color.text.muted,
               textAlign: "center",
               maxWidth: 380,
               lineHeight: 1.6,
            }}
         >
            {msg.body}
         </Typography>
         {tab !== "past" && (
            <Box
               component="button"
               onClick={onBook}
               sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  py: 0.875,
                  px: 2.5,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${tokens.color.primary[700]}`,
                  backgroundColor: "transparent",
                  color: tokens.color.primary[700],
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                  },
               }}
            >
               <AddIcon sx={{ fontSize: 18 }} />
               Book appointment
            </Box>
         )}
      </Box>
   );
}

// ── Stat chip helper ────────────────────────────────────────────────────────
function StatChip({
   icon,
   label,
   value,
   color,
}: {
   icon?: React.ReactNode;
   label: string;
   value: number;
   color: string;
}) {
   return (
      <Box
         sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.875,
            px: 1.75,
            py: 0.75,
            borderRadius: `${tokens.radius.control}px`,
            border: `1px solid ${alpha(color, 0.25)}`,
            backgroundColor: alpha(color, 0.06),
         }}
      >
         {icon && <Box sx={{ color, display: "flex" }}>{icon}</Box>}
         <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color }}>
            {value}
         </Typography>
         <Typography
            sx={{ fontSize: "0.78rem", color: tokens.color.text.muted }}
         >
            {label}
         </Typography>
      </Box>
   );
}
