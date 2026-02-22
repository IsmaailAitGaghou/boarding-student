import { Box, LinearProgress } from "@mui/material";

interface LoadingScreenProps {
   /**
    * Show the loading screen
    */
   loading?: boolean;
}

/**
 * LoadingScreen - Top progress bar for page transitions/navigation
 * Usage: <LoadingScreen loading={isNavigating} />
 */
export function LoadingScreen({ loading = true }: LoadingScreenProps) {
   if (!loading) return null;

   return (
      <Box
         sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
         }}
      >
         <LinearProgress />
      </Box>
   );
}
