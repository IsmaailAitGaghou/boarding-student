import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./app";

// Minimal router scaffold. Add feature routes as you build them.
export const router = createBrowserRouter([
   {
      path: "/",
      element: <AppShell />,
   },
]);
