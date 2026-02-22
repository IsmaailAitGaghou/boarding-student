import {
   Card,
   Box,
   Typography,
   TextField,
   Grid,
   Button,
   CircularProgress,
   IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "@/app/theme";

type PersonalInfoSectionProps = {
   fullName: string;
   email: string;
   phone: string;
   school: string;
   country: string;
   isEditMode: boolean;
   onChange: (field: string, value: string) => void;
   onEdit: () => void;
   onSave: () => void;
   onCancel: () => void;
   saving: boolean;
};

type InfoFieldProps = {
   label: string;
   value: string;
   field: string;
   readOnly?: boolean;
   isEditMode: boolean;
   onChange: (field: string, value: string) => void;
};

function InfoField({
   label,
   value,
   field,
   readOnly = false,
   isEditMode,
   onChange,
}: InfoFieldProps) {
   if (!isEditMode) {
      return (
         <Box>
            <Typography
               variant="caption"
               color="text.secondary"
               sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
            >
               {label}
            </Typography>
            <Typography variant="body1">{value || "Not provided"}</Typography>
         </Box>
      );
   }

   return (
      <TextField
         fullWidth
         label={label}
         value={value}
         onChange={(e) => onChange(field, e.target.value)}
         size="small"
         disabled={readOnly}
         sx={{
            "& .MuiInputBase-input.Mui-disabled": {
               WebkitTextFillColor: tokens.color.text.secondary,
            },
         }}
      />
   );
}

export function PersonalInfoSection({
   fullName,
   email,
   phone,
   school,
   country,
   isEditMode,
   onChange,
   onEdit,
   onSave,
   onCancel,
   saving,
}: PersonalInfoSectionProps) {
   return (
      <Card
         sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               mb: 3,
            }}
         >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
               Personal Information
            </Typography>

            {!isEditMode ? (
               <IconButton
                  size="small"
                  onClick={onEdit}
                  sx={{
                     color: tokens.color.primary[700],
                     "&:hover": {
                        backgroundColor: tokens.color.primary[300] + "10",
                     },
                  }}
               >
                  <EditIcon fontSize="small" />
               </IconButton>
            ) : (
               <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                     variant="outlined"
                     size="small"
                     startIcon={<CloseIcon />}
                     onClick={onCancel}
                     disabled={saving}
                     sx={{
                        borderColor: tokens.color.border,
                        color: tokens.color.text.primary,
                        "&:hover": {
                           borderColor: tokens.color.error,
                           backgroundColor: tokens.color.error + "10",
                        },
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="contained"
                     size="small"
                     startIcon={
                        saving ? <CircularProgress size={16} /> : <SaveIcon />
                     }
                     onClick={onSave}
                     disabled={saving}
                     sx={{
                        backgroundColor: tokens.color.primary[700],
                        "&:hover": {
                           backgroundColor: tokens.color.primary[900],
                        },
                     }}
                  >
                     {saving ? "Saving..." : "Save"}
                  </Button>
               </Box>
            )}
         </Box>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
               <InfoField
                  label="Full Name"
                  value={fullName}
                  field="fullName"
                  isEditMode={isEditMode}
                  onChange={onChange}
               />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <InfoField
                  label="Email"
                  value={email}
                  field="email"
                  readOnly
                  isEditMode={isEditMode}
                  onChange={onChange}
               />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <InfoField
                  label="Phone"
                  value={phone}
                  field="phone"
                  isEditMode={isEditMode}
                  onChange={onChange}
               />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <InfoField
                  label="School"
                  value={school}
                  field="school"
                  isEditMode={isEditMode}
                  onChange={onChange}
               />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <InfoField
                  label="Country"
                  value={country}
                  field="country"
                  isEditMode={isEditMode}
                  onChange={onChange}
               />
            </Grid>
         </Grid>
      </Card>
   );
}
