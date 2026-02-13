import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/auth-context";

type ProtectedRouteProps = {
   children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return (
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               minHeight: "100vh",
            }}
         >
            <CircularProgress />
         </Box>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }

   return <>{children}</>;
}
