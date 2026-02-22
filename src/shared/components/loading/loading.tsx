import { Box, CircularProgress, LinearProgress } from "@mui/material";

type LoadingVariant = "fullPage" | "section" | "inline";
type LoadingType = "circular" | "linear";

interface LoadingProps {
   /**
    * Variant determines layout and spacing
    * - fullPage: Fixed position, full viewport, centered
    * - section: Flexbox centered with min-height (for cards/sections)
    * - inline: Compact, no extra spacing (for buttons/small areas)
    */
   variant?: LoadingVariant;
   /**
    * Type of loading indicator
    * - circular: Spinner (default)
    * - linear: Progress bar
    */
   type?: LoadingType;
   /**
    * Size of the circular progress (ignored for linear)
    */
   size?: number;
   /**
    * Minimum height for section variant
    */
   minHeight?: number;
}

/**
 * Reusable Loading component with multiple variants
 *
 * Examples:
 * ```tsx
 * // Full page loader
 * <Loading variant="fullPage" />
 *
 * // Section loader (cards, panels)
 * <Loading variant="section" minHeight={400} />
 *
 * // Inline loader (buttons, small areas)
 * <Loading variant="inline" size={20} />
 *
 * // Linear progress bar
 * <Loading variant="section" type="linear" />
 * ```
 */
export function Loading({
   variant = "section",
   type = "circular",
   size = 40,
   minHeight = 200,
}: LoadingProps) {
   // Full page variant
   if (variant === "fullPage") {
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
            {type === "circular" ? (
               <CircularProgress size={size} />
            ) : (
               <Box sx={{ width: "100%", maxWidth: 400 }}>
                  <LinearProgress />
               </Box>
            )}
         </Box>
      );
   }

   // Section variant (for cards, panels, etc.)
   if (variant === "section") {
      return (
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               minHeight,
               width: "100%",
            }}
         >
            {type === "circular" ? (
               <CircularProgress size={size} />
            ) : (
               <Box sx={{ width: "100%", maxWidth: 400 }}>
                  <LinearProgress />
               </Box>
            )}
         </Box>
      );
   }

   // Inline variant (compact, no extra spacing)
   return type === "circular" ? (
      <CircularProgress size={size} />
   ) : (
      <LinearProgress sx={{ width: "100%" }} />
   );
}
