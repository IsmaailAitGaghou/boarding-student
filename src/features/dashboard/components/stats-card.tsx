import { Card, Stack, Typography, Box, alpha } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { tokens } from "@/app/theme";

type StatsCardProps = {
   title: string;
   value: string | number;
   change?: number;
   trend?: "up" | "down";
   icon: React.ReactElement;
   color?: string;
};

export function StatsCard({
   title,
   value,
   change,
   trend = "up",
   icon,
   color = tokens.color.primary[700],
}: StatsCardProps) {
   const showChange = change !== undefined && change !== 0;

   return (
      <Card
         sx={{
            p: 3,
            height: "100%",
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
            transition: "all 0.2s",
            "&:hover": {
               boxShadow: tokens.shadow.sm,
               transform: "translateY(-2px)",
            },
         }}
      >
         <Stack spacing={2}>
            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}
            >
               <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
               >
                  {title}
               </Typography>
               <Box
                  sx={{
                     width: 40,
                     height: 40,
                     borderRadius: 1,
                     backgroundColor: alpha(color, 0.08),
                     display: "grid",
                     placeItems: "center",
                     color: color,
                  }}
               >
                  {icon}
               </Box>
            </Box>

            <Box>
               <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {value}
               </Typography>

               {showChange && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                     {trend === "up" ? (
                        <TrendingUpIcon
                           sx={{ fontSize: 16, color: tokens.color.success }}
                        />
                     ) : (
                        <TrendingDownIcon
                           sx={{ fontSize: 16, color: tokens.color.error }}
                        />
                     )}
                     <Typography
                        variant="caption"
                        sx={{
                           color:
                              trend === "up"
                                 ? tokens.color.success
                                 : tokens.color.error,
                           fontWeight: 600,
                        }}
                     >
                        {change > 0 ? "+" : ""}
                        {change}%
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        last month
                     </Typography>
                  </Box>
               )}
            </Box>
         </Stack>
      </Card>
   );
}
