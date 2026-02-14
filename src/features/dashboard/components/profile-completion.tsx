import { Card, Box, Typography, LinearProgress } from "@mui/material";
import { tokens } from "@/app/theme";

type ProfileCompletionProps = {
   percentage: number;
};

export function ProfileCompletion({ percentage }: ProfileCompletionProps) {
   if (percentage >= 100) {
      return null; // Hide when profile is complete
   }

   return (
      <Card
         sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
            mb: 3,
         }}
      >
         <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
               Profile completion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
               {percentage}% completed. Complete your profile to unlock all
               features.
            </Typography>
            <LinearProgress
               variant="determinate"
               value={percentage}
               sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: tokens.color.border,
                  "& .MuiLinearProgress-bar": {
                     backgroundColor: tokens.color.primary[700],
                     borderRadius: 4,
                  },
               }}
            />
         </Box>
      </Card>
   );
}
