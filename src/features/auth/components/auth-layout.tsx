import type { ReactNode } from "react";

import { Box, Container, Stack, Typography } from "@mui/material";

export type AuthLayoutProps = {
   brand?: ReactNode;
   leftTitle: string;
   leftDescription: string;
   leftFooter?: ReactNode;
   leftOverlay?: ReactNode;
   backgroundImageUrl?: string;
   children: ReactNode;
};

export function AuthLayout({
   brand,
   leftTitle,
   leftDescription,
   leftFooter,
   leftOverlay,
   backgroundImageUrl,
   children,
}: AuthLayoutProps) {
   return (
      <Box
         sx={{
            minHeight: "100dvh",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            backgroundColor: "background.default",
         }}
      >
         <Box
            sx={{
               display: { xs: "none", md: "block" },
               position: "relative",
               overflow: "hidden",
               px: { xs: 2, sm: 3, md: 4 },
               color: "common.white",
               backgroundColor: "grey.900",
            }}
         >
            <Box
               sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: backgroundImageUrl
                     ? `url(${backgroundImageUrl})`
                     : "linear-gradient(135deg, rgba(12,119,121,1) 0%, rgba(0,84,97,1) 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: backgroundImageUrl ? "saturate(1.1)" : undefined,
                  transform: "scale(1.12)",
               }}
            />
            {/* Dark overlay for contrast */}
            <Box
               sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                     "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)",
               }}
            />

            <Container
               sx={{
                  position: "relative",
                  height: "95%",
                  py: 5,
                  display: "flex",
                  flexDirection: "column",
               }}
               maxWidth={false}
            >
               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {brand}
               </Box>

               <Box sx={{ flex: 1 }} />

               <Stack spacing={3.5} sx={{ maxWidth: 520 }}>
                  <Typography
                     variant="h1"
                     sx={{
                        fontFamily: "Satoshi, Montserrat, sans-serif",
                        color: "common.white",
                     }}
                  >
                     {leftTitle}
                  </Typography>

                  <Typography
                     variant="body1"
                     sx={{ color: "rgba(255,255,255,0.85)" }}
                  >
                     {leftDescription}
                  </Typography>

                  {leftOverlay}
               </Stack>

               <Box sx={{ flex: 1 }} />

               <Box sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                  {leftFooter}
               </Box>
            </Container>
         </Box>

         {/* Right panel (form) */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               px: { xs: 2, sm: 3, md: 6 },
               py: { xs: 4, md: 6 },
            }}
         >
            <Box sx={{ width: "100%", maxWidth: 460 }}>{children}</Box>
         </Box>
      </Box>
   );
}
