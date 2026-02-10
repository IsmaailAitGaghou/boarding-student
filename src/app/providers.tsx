import React from "react";

export type AppProvidersProps = {
   children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
   return <>{children}</>;
}
