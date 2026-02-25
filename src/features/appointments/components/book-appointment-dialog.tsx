import { useState } from "react";
import {
   Box,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Typography,
   TextField,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   ToggleButtonGroup,
   ToggleButton,
   CircularProgress,
   alpha,
   IconButton,
   FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { tokens } from "@/app/theme";
import { getAdvisors, getTimeSlots } from "../api";
import type { AppointmentType, BookingPayload } from "../types";

interface BookAppointmentDialogProps {
   open: boolean;
   onClose: () => void;
   onSubmit: (payload: BookingPayload) => Promise<void>;
   submitting?: boolean;
}

interface FormState {
   advisorId: string;
   type: AppointmentType;
   date: string;
   timeSlot: string;
   notes: string;
}

const EMPTY_FORM: FormState = {
   advisorId: "",
   type: "Online",
   date: "",
   timeSlot: "",
   notes: "",
};

function getTodayStr() {
   return new Date().toISOString().split("T")[0];
}

export function BookAppointmentDialog({
   open,
   onClose,
   onSubmit,
   submitting,
}: BookAppointmentDialogProps) {
   const [form, setForm] = useState<FormState>(EMPTY_FORM);
   const [errors, setErrors] = useState<
      Partial<Record<keyof FormState, string>>
   >({});

   // Static lists — derived directly (no state needed for pure sync calls)
   const advisors = getAdvisors();
   const timeSlots =
      form.date && form.advisorId
         ? getTimeSlots(form.date, form.advisorId)
         : [];

   function set<K extends keyof FormState>(key: K, value: FormState[K]) {
      setForm((f) => ({ ...f, [key]: value }));
      setErrors((e) => ({ ...e, [key]: undefined }));
   }

   function validate(): boolean {
      const newErrors: typeof errors = {};
      if (!form.advisorId) newErrors.advisorId = "Please select an advisor";
      if (!form.date) newErrors.date = "Please select a date";
      if (!form.timeSlot) newErrors.timeSlot = "Please select a time slot";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   }

   async function handleSubmit() {
      if (!validate()) return;
      await onSubmit({
         advisorId: form.advisorId,
         date: form.date,
         timeSlot: form.timeSlot,
         type: form.type,
         notes: form.notes.trim() || undefined,
      });
   }

   return (
      <Dialog
         key={open ? "open" : "closed"}
         open={open}
         onClose={!submitting ? onClose : undefined}
         maxWidth="sm"
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
                  Book an appointment
               </Typography>
               <Typography
                  variant="body2"
                  sx={{ color: tokens.color.text.muted, mt: 0.25 }}
               >
                  Schedule time with an advisor
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
               {/* Appointment type toggle */}
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
                     Appointment type
                  </Typography>
                  <ToggleButtonGroup
                     value={form.type}
                     exclusive
                     onChange={(_, val: AppointmentType | null) => {
                        if (val) set("type", val);
                     }}
                     size="small"
                     sx={{ gap: 1 }}
                  >
                     <ToggleButton
                        value="Online"
                        sx={{
                           borderRadius: `${tokens.radius.control}px !important`,
                           border: `1.5px solid ${tokens.color.border} !important`,
                           px: 2,
                           fontWeight: 700,
                           fontSize: "0.8rem",
                           gap: 0.75,
                           "&.Mui-selected": {
                              backgroundColor: alpha(
                                 tokens.color.primary[700],
                                 0.1,
                              ),
                              borderColor: `${tokens.color.primary[700]} !important`,
                              color: tokens.color.primary[700],
                           },
                        }}
                     >
                        <VideocamOutlinedIcon sx={{ fontSize: 16 }} />
                        Online
                     </ToggleButton>
                     <ToggleButton
                        value="On-site"
                        sx={{
                           borderRadius: `${tokens.radius.control}px !important`,
                           border: `1.5px solid ${tokens.color.border} !important`,
                           px: 2,
                           fontWeight: 700,
                           fontSize: "0.8rem",
                           gap: 0.75,
                           "&.Mui-selected": {
                              backgroundColor: alpha(tokens.color.warning, 0.1),
                              borderColor: `${tokens.color.warning} !important`,
                              color: tokens.color.warning,
                           },
                        }}
                     >
                        <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                        On-site
                     </ToggleButton>
                  </ToggleButtonGroup>
               </Box>

               {/* Advisor select */}
               <FormControl size="small" error={Boolean(errors.advisorId)}>
                  <InputLabel>Advisor</InputLabel>
                  <Select
                     label="Advisor"
                     value={form.advisorId}
                     onChange={(e) => set("advisorId", e.target.value)}
                     sx={{
                        borderRadius: `${tokens.radius.control}px`,
                        "& .MuiOutlinedInput-notchedOutline": {
                           borderColor: errors.advisorId
                              ? tokens.color.error
                              : tokens.color.border,
                        },
                     }}
                  >
                     {advisors.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                           <Box>
                              <Typography
                                 sx={{ fontSize: "0.85rem", fontWeight: 600 }}
                              >
                                 {a.name}
                              </Typography>
                              <Typography
                                 variant="caption"
                                 sx={{ color: tokens.color.text.muted }}
                              >
                                 {a.role}
                              </Typography>
                           </Box>
                        </MenuItem>
                     ))}
                  </Select>
                  {errors.advisorId && (
                     <FormHelperText>{errors.advisorId}</FormHelperText>
                  )}
               </FormControl>

               {/* Date picker */}
               <TextField
                  label="Date"
                  type="date"
                  size="small"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
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
               {form.date && form.advisorId && (
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
                        Available time slots
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
                              onClick={() => set("timeSlot", slot)}
                              sx={{
                                 py: 0.625,
                                 px: 1.5,
                                 borderRadius: `${tokens.radius.control}px`,
                                 border: `1.5px solid ${
                                    form.timeSlot === slot
                                       ? tokens.color.primary[700]
                                       : tokens.color.border
                                 }`,
                                 backgroundColor:
                                    form.timeSlot === slot
                                       ? alpha(tokens.color.primary[700], 0.1)
                                       : "transparent",
                                 color:
                                    form.timeSlot === slot
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

               {/* Notes */}
               <TextField
                  label="Notes (optional)"
                  multiline
                  minRows={3}
                  size="small"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any topics you'd like to discuss…"
                  sx={{
                     "& .MuiOutlinedInput-root": {
                        borderRadius: `${tokens.radius.control}px`,
                        "& fieldset": { borderColor: tokens.color.border },
                     },
                  }}
               />
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
               {submitting ? "Booking…" : "Book appointment"}
            </Box>
         </DialogActions>
      </Dialog>
   );
}
