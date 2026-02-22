import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { ProfilePage } from "@/features/profile";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { DashboardLayout } from "@/shared/layouts/dashboard-layout";
import { Box, Typography } from "@mui/material";

// Placeholder component for unimplemented pages
function PlaceholderPage({ title }: { title: string }) {
   return (
      <Box>
         <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            {title}
         </Typography>
         <Typography variant="body2" color="text.secondary">
            This page is under construction. Check back soon!
         </Typography>
      </Box>
   );
}

export const router = createBrowserRouter([
   // Auth routes (public)
   { path: "/", element: <Navigate to="/dashboard" replace /> },
   { path: "/login", element: <LoginPage /> },
   { path: "/signup", element: <SignupPage /> },

   // App routes (protected)
   {
      path: "/",
      element: (
         <ProtectedRoute>
            <DashboardLayout />
         </ProtectedRoute>
      ),
      children: [
         { index: true, element: <Navigate to="/dashboard" replace /> },
         { path: "dashboard", element: <DashboardPage /> },
         { path: "profile", element: <ProfilePage /> },
         { path: "cv", element: <PlaceholderPage title="CV Management" /> },
         {
            path: "journey",
            element: <PlaceholderPage title="Journey Tracking" />,
         },
         {
            path: "matching",
            element: <PlaceholderPage title="Company Matching" />,
         },
         {
            path: "appointments",
            element: <PlaceholderPage title="Appointments" />,
         },
         { path: "messaging", element: <PlaceholderPage title="Messaging" /> },
         { path: "resources", element: <PlaceholderPage title="Resources" /> },
      ],
   },
]);
