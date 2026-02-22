import { Box, CircularProgress } from "@mui/material";

/**
 * SplashScreen - Full-screen loader for initial app load
 * Usage: Wrap app in <Suspense fallback={<SplashScreen />}>
 */
export function SplashScreen() {
   return (
      <Box
         sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.default",
            zIndex: 9999,
         }}
      >
         <CircularProgress size={64} thickness={3} />
      </Box>
   );
}
