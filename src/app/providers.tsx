import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createAppMuiTheme, defaultTheme } from "./theme";
import { AuthProvider } from "@/contexts/auth-context";

export type AppProvidersProps = {
   children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
   const theme = React.useMemo(() => createAppMuiTheme(defaultTheme.mode), []);

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
   );
}