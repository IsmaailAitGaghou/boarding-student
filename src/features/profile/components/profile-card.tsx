import {
   Card,
   Box,
   Avatar,
   Typography,
   CircularProgress,
   Stack,
} from "@mui/material";
import { format } from "date-fns";
import { tokens } from "@/app/theme";

type ProfileCardProps = {
   fullName: string;
   email: string;
   profileCompletion: number;
   memberSince?: string;
};

export function ProfileCard({
   fullName,
   email,
   profileCompletion,
   memberSince,
}: ProfileCardProps) {
   const getInitials = (name: string) => {
      return name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
   };

   const getCompletionColor = (percentage: number) => {
      if (percentage >= 80) return tokens.color.success;
      if (percentage >= 50) return tokens.color.warning;
      return tokens.color.error;
   };

   return (
      <Card
         sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
            height: "fit-content",
            // position: "sticky",
            // top: 79,
            zIndex: 99,
         }}
      >
         <Stack spacing={3} alignItems="center">
            {/* Avatar */}
            <Box sx={{ position: "relative" }}>
               <Avatar
                  sx={{
                     width: 120,
                     height: 120,
                     bgcolor: tokens.color.primary[700],
                     fontSize: "2.5rem",
                     fontWeight: 700,
                  }}
               >
                  {getInitials(fullName)}
               </Avatar>
            </Box>

            {/* User Info */}
            <Box sx={{ textAlign: "center", width: "100%" }}>
               <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {fullName}
               </Typography>
               <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
               >
                  {email}
               </Typography>
               {memberSince && (
                  <Typography variant="caption" color="text.secondary">
                     Member since {format(new Date(memberSince), "MMMM yyyy")}
                  </Typography>
               )}
            </Box>

            {/* Profile Completion */}
            <Box
               sx={{
                  width: "100%",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: tokens.color.background,
                  textAlign: "center",
               }}
            >
               <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
               >
                  Profile Completion
               </Typography>
               <Box
                  sx={{ position: "relative", display: "inline-flex", mb: 1 }}
               >
                  <CircularProgress
                     variant="determinate"
                     value={profileCompletion}
                     size={80}
                     thickness={4}
                     sx={{
                        color: getCompletionColor(profileCompletion),
                        "& .MuiCircularProgress-circle": {
                           strokeLinecap: "round",
                        },
                     }}
                  />
                  <Box
                     sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                     >
                        {profileCompletion}%
                     </Typography>
                  </Box>
               </Box>
               <Typography variant="body2" color="text.secondary">
                  {profileCompletion < 100
                     ? "Complete your profile to improve matches"
                     : "Your profile is complete!"}
               </Typography>
            </Box>
         </Stack>
      </Card>
   );
}
