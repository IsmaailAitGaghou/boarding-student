import { useState } from "react";
import {
   Box,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Typography,
   TextField,
   CircularProgress,
   alpha,
   IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "@/app/theme";
import { getTimeSlotsSync } from "../api";
import type { ReschedulePayload } from "../types";

interface RescheduleDialogProps {
   open: boolean;
   appointmentId: string | null;
   onClose: () => void;
   onSubmit: (id: string, payload: ReschedulePayload) => Promise<void>;
   submitting?: boolean;
}

function getTodayStr() {
   return new Date().toISOString().split("T")[0];
}

export function RescheduleDialog({
   open,
   appointmentId,
   onClose,
   onSubmit,
   submitting,
}: RescheduleDialogProps) {
   const [date, setDate] = useState("");
   const [timeSlot, setTimeSlot] = useState("");
   const [errors, setErrors] = useState<{ date?: string; timeSlot?: string }>(
      {},
   );

   const timeSlots = date ? getTimeSlotsSync(date, "") : [];

   function validate() {
      const e: typeof errors = {};
      if (!date) e.date = "Please select a date";
      if (!timeSlot) e.timeSlot = "Please select a time slot";
      setErrors(e);
      return Object.keys(e).length === 0;
   }

   async function handleSubmit() {
      if (!validate() || !appointmentId) return;
      await onSubmit(appointmentId, { date, timeSlot });
   }

   return (
      <Dialog
         key={open ? "open" : "closed"}
         open={open}
         onClose={!submitting ? onClose : undefined}
         maxWidth="xs"
         fullWidth
         PaperProps={{
            sx: {
               borderRadius: `${tokens.radius.modal}px`,
               boxShadow: tokens.shadow.md,
            },
         }}
      >
         <DialogTitle
            sx={{
               px: 3,
               pt: 3,
               pb: 1.5,
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
            }}
         >
            <Box>
               <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: tokens.color.text.primary }}
               >
                  Reschedule appointment
               </Typography>
               <Typography
                  variant="body2"
                  sx={{ color: tokens.color.text.muted, mt: 0.25 }}
               >
                  Pick a new date and time
               </Typography>
            </Box>
            <IconButton
               onClick={onClose}
               disabled={submitting}
               size="small"
               sx={{ color: tokens.color.text.muted }}
            >
               <CloseIcon fontSize="small" />
            </IconButton>
         </DialogTitle>

         <DialogContent sx={{ px: 3, pb: 1 }}>
            <Box
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  pt: 1,
               }}
            >
               {/* Date */}
               <TextField
                  label="New date"
                  type="date"
                  size="small"
                  value={date}
                  onChange={(e) => {
                     setDate(e.target.value);
                     setTimeSlot("");
                     setErrors((er) => ({ ...er, date: undefined }));
                  }}
                  inputProps={{ min: getTodayStr() }}
                  error={Boolean(errors.date)}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                     "& .MuiOutlinedInput-root": {
                        borderRadius: `${tokens.radius.control}px`,
                        "& fieldset": { borderColor: tokens.color.border },
                     },
                  }}
               />

               {/* Time slots */}
               {date && (
                  <Box>
                     <Typography
                        variant="caption"
                        sx={{
                           display: "block",
                           mb: 1,
                           fontWeight: 700,
                           color: tokens.color.text.muted,
                           textTransform: "uppercase",
                           letterSpacing: "0.06em",
                           fontSize: "0.68rem",
                        }}
                     >
                        Available slots
                     </Typography>
                     {errors.timeSlot && (
                        <Typography
                           variant="caption"
                           sx={{
                              color: tokens.color.error,
                              mb: 0.75,
                              display: "block",
                           }}
                        >
                           {errors.timeSlot}
                        </Typography>
                     )}
                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {timeSlots.map((slot) => (
                           <Box
                              key={slot}
                              component="button"
                              onClick={() => {
                                 setTimeSlot(slot);
                                 setErrors((er) => ({
                                    ...er,
                                    timeSlot: undefined,
                                 }));
                              }}
                              sx={{
                                 py: 0.625,
                                 px: 1.5,
                                 borderRadius: `${tokens.radius.control}px`,
                                 border: `1.5px solid ${
                                    timeSlot === slot
                                       ? tokens.color.primary[700]
                                       : tokens.color.border
                                 }`,
                                 backgroundColor:
                                    timeSlot === slot
                                       ? alpha(tokens.color.primary[700], 0.1)
                                       : "transparent",
                                 color:
                                    timeSlot === slot
                                       ? tokens.color.primary[700]
                                       : tokens.color.text.secondary,
                                 fontWeight: 700,
                                 fontSize: "0.78rem",
                                 cursor: "pointer",
                                 transition: "all 0.12s",
                                 "&:hover": {
                                    borderColor: tokens.color.primary[500],
                                    color: tokens.color.primary[700],
                                    backgroundColor: alpha(
                                       tokens.color.primary[700],
                                       0.05,
                                    ),
                                 },
                              }}
                           >
                              {slot}
                           </Box>
                        ))}
                     </Box>
                  </Box>
               )}
            </Box>
         </DialogContent>

         <DialogActions sx={{ px: 3, py: 2.5, gap: 1.25 }}>
            <Box
               component="button"
               onClick={onClose}
               disabled={submitting}
               sx={{
                  py: 0.875,
                  px: 2.5,
                  borderRadius: `${tokens.radius.control}px`,
                  border: `1.5px solid ${tokens.color.border}`,
                  backgroundColor: "transparent",
                  color: tokens.color.text.secondary,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  "&:hover:not(:disabled)": {
                     borderColor: tokens.color.primary[700],
                     color: tokens.color.primary[700],
                  },
               }}
            >
               Cancel
            </Box>
            <Box
               component="button"
               onClick={() => {
                  void handleSubmit();
               }}
               disabled={submitting}
               sx={{
                  py: 0.875,
                  px: 2.5,
                  borderRadius: `${tokens.radius.control}px`,
                  border: "none",
                  backgroundColor: tokens.color.primary[700],
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: submitting ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  transition: "background-color 0.15s",
                  "&:hover:not(:disabled)": {
                     backgroundColor: tokens.color.primary[900],
                  },
               }}
            >
               {submitting && (
                  <CircularProgress size={14} sx={{ color: "#fff" }} />
               )}
               {submitting ? "Rescheduling…" : "Confirm"}
            </Box>
         </DialogActions>
      </Dialog>
   );
}
