import { Box, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { tokens } from "@/app/theme";

export function CvEmptyState() {
   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 3,
            textAlign: "center",
         }}
      >
         <Box
            sx={{
               width: 80,
               height: 80,
               borderRadius: "50%",
               backgroundColor: tokens.color.background,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               mb: 3,
            }}
         >
            <DescriptionOutlinedIcon
               sx={{ fontSize: 40, color: "text.secondary" }}
            />
         </Box>
         <Typography
            variant="h3"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
         >
            No CV Uploaded
         </Typography>
         <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400 }}
         >
            Upload your CV to let potential employers know about your
            qualifications and experience. Supported formats: PDF, DOC, DOCX.
         </Typography>
      </Box>
   );
}
