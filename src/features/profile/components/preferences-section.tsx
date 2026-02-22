import {
   Card,
   Box,
   Typography,
   TextField,
   MenuItem,
   Grid,
} from "@mui/material";
import { tokens } from "@/app/theme";

type PreferencesSectionProps = {
   preferredLocation: string;
   internshipType: string;
   isEditMode: boolean;
   onChange: (field: string, value: string) => void;
};

const internshipTypes = [
   { value: "", label: "Select type" },
   { value: "Full-time", label: "Full-time" },
   { value: "Part-time", label: "Part-time" },
   { value: "Remote", label: "Remote" },
   { value: "Hybrid", label: "Hybrid" },
   { value: "On-site", label: "On-site" },
];

export function PreferencesSection({
   preferredLocation,
   internshipType,
   isEditMode,
   onChange,
}: PreferencesSectionProps) {
   if (!isEditMode) {
      return (
         <Card
            sx={{
               p: 4,
               borderRadius: 2,
               boxShadow: "none",
               border: `1px solid ${tokens.color.border}`,
            }}
         >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
               Preferences
            </Typography>

            <Grid container spacing={3}>
               <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                     <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
                     >
                        Preferred Location
                     </Typography>
                     <Typography variant="body1">
                        {preferredLocation || "Not specified"}
                     </Typography>
                  </Box>
               </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                     <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
                     >
                        Internship Type
                     </Typography>
                     <Typography variant="body1">
                        {internshipType || "Not specified"}
                     </Typography>
                  </Box>
               </Grid>
            </Grid>
         </Card>
      );
   }

   return (
      <Card
         sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Preferences
         </Typography>

         <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
               <TextField
                  fullWidth
                  label="Preferred Location"
                  value={preferredLocation}
                  onChange={(e) =>
                     onChange("preferredLocation", e.target.value)
                  }
                  size="small"
                  placeholder="e.g., San Francisco, CA"
               />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <TextField
                  fullWidth
                  select
                  label="Internship Type"
                  value={internshipType}
                  onChange={(e) => onChange("internshipType", e.target.value)}
                  size="small"
               >
                  {internshipTypes.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
            </Grid>
         </Grid>
      </Card>
   );
}
