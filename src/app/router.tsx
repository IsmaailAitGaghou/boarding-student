import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./app";
import { LoginPage, SignupPage } from "@/features/auth";

export const router = createBrowserRouter([
   // Temporary: until dashboard is implemented, default to login.
   { path: "/", element: <Navigate to="/login" replace /> },
   { path: "/login", element: <LoginPage /> },
   { path: "/signup", element: <SignupPage /> },
   // Placeholder for app shell (future authenticated area)
   { path: "/app", element: <AppShell /> },
]);
