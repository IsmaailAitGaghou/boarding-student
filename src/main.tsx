import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import { SplashScreen } from "./shared/components/loading";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <Suspense fallback={<SplashScreen  />}>
         <AppProviders>
            <RouterProvider router={router} />
         </AppProviders>
      </Suspense>
   </StrictMode>,
);
