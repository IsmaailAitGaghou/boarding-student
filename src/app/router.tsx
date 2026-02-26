import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { ProfilePage } from "@/features/profile";
import { CvPage } from "@/features/cv";
import { JourneyPage } from "@/features/journey";
import { MatchingPage } from "@/features/matching";
import { AppointmentsPage } from "@/features/appointments";
import { MessagingPage } from "@/features/messaging";
import { ResourcesPage } from "@/features/resources";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { DashboardLayout } from "@/shared/layouts/dashboard-layout";

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
         { path: "cv", element: <CvPage /> },
         { path: "journey", element: <JourneyPage /> },
         {
            path: "matching",
            element: <MatchingPage />,
         },
         {
            path: "appointments",
            element: <AppointmentsPage />,
         },
         { path: "messaging", element: <MessagingPage /> },
         { path: "resources", element: <ResourcesPage /> },
      ],
   },
]);
