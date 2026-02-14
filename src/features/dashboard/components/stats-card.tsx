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
   chartData?: number[];
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
            p: 4,
            height: "100%",
            width: "100%",
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
            {/* Header */}
            <Box
               sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
               }}
            >
               <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
               >
                  {title}
               </Typography>
               <Box
                  sx={{
                     width: 40,
                     height: 40,
                     borderRadius: 1.5,
                     backgroundColor: alpha(color, 0.08),
                     display: "grid",
                     placeItems: "center",
                     color: color,
                  }}
               >
                  {icon}
               </Box>
            </Box>

            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
               }}
            >
               <Box sx={{ flex: "0 0 auto" }}>
                  <Typography
                     variant="h2"
                     sx={{
                        fontWeight: 800,
                        fontSize: "2rem",
                        mb: 1,
                        lineHeight: 1,
                     }}
                  >
                     {value}
                  </Typography>

                  {showChange && (
                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box
                           sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.25,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.75,
                              backgroundColor:
                                 trend === "up"
                                    ? alpha(tokens.color.success, 0.12)
                                    : alpha(tokens.color.error, 0.12),
                           }}
                        >
                           {trend === "up" ? (
                              <TrendingUpIcon
                                 sx={{
                                    fontSize: 14,
                                    color: tokens.color.success,
                                 }}
                              />
                           ) : (
                              <TrendingDownIcon
                                 sx={{
                                    fontSize: 14,
                                    color: tokens.color.error,
                                 }}
                              />
                           )}
                           <Typography
                              variant="caption"
                              sx={{
                                 color:
                                    trend === "up"
                                       ? tokens.color.success
                                       : tokens.color.error,
                                 fontWeight: 700,
                                 fontSize: "0.75rem",
                              }}
                           >
                              {change > 0 ? "+" : ""}
                              {change}%
                           </Typography>
                        </Box>
                        <Typography
                           variant="caption"
                           color="text.secondary"
                           sx={{ fontSize: "0.75rem" }}
                        >
                           last 7 days
                        </Typography>
                     </Box>
                  )}
               </Box>

            </Box>
         </Stack>
      </Card>
   );
}
