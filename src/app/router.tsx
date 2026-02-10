import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./app";


export const router = createBrowserRouter([
   {
      path: "/",
      element: <AppShell />,
   },
]);
