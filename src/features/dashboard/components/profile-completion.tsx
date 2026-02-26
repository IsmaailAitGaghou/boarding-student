import {
   Card,
   Box,
   Typography,
   LinearProgress,
   Button,
   alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";

type ProfileCompletionProps = {
   percentage: number;
};

export function ProfileCompletion({ percentage }: ProfileCompletionProps) {
   const navigate = useNavigate();

   if (percentage >= 100) {
      return null; // Hide when profile is complete
   }

   return (
      <Card
         sx={{
            p: 2.5,
            borderRadius: `${tokens.radius.card}px`,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
            mb: 3,
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:hover": {
               border: `1px solid ${alpha(tokens.color.primary[300], 0.3)}`,
               boxShadow: tokens.shadow.sm,
            },
         }}
      >
         <Box
            sx={{
               display: "flex",
               alignItems: "flex-start",
               justifyContent: "space-between",
               flexWrap: "wrap",
               gap: 2,
            }}
         >
            {/* Left: text + progress */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 1,
                     mb: 0.5,
                  }}
               >
                  <Box
                     sx={{
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: `${tokens.radius.control}px`,
                        backgroundColor: tokens.color.primary[700],
                        color: tokens.color.surface,
                        flexShrink: 0,
                     }}
                  >
                     <PersonOutlineIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography
                     variant="body1"
                     sx={{ fontWeight: 700, color: tokens.color.text.primary }}
                  >
                     Profile {percentage}% complete
                  </Typography>
               </Box>

               <Typography
                  variant="body2"
                  sx={{
                     color: tokens.color.text.secondary,
                     mb: 1.5,
                     fontSize: "0.8125rem",
                  }}
               >
                  Complete your profile to unlock all features and increase
                  visibility to companies.
               </Typography>

               <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                     height: 6,
                     borderRadius: 4,
                     backgroundColor: alpha(tokens.color.primary[700], 0.1),
                     "& .MuiLinearProgress-bar": {
                        backgroundColor: tokens.color.primary[700],
                        borderRadius: 4,
                     },
                  }}
               />
            </Box>

            {/* Right: CTA button */}
            <Button
               variant="contained"
               size="small"
               endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
               onClick={() => navigate("/profile")}
               sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  borderRadius: `${tokens.radius.control}px`,
                  backgroundColor: tokens.color.primary[700],
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  alignSelf: "center",
                  "&:hover": {
                     backgroundColor: tokens.color.primary[700],
                     boxShadow: tokens.shadow.sm,
                     filter: "brightness(0.93)",
                  },
               }}
            >
               Complete Profile
            </Button>
         </Box>
      </Card>
   );
}
