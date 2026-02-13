import { Card, Stack, Typography, Box, Avatar } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { tokens } from "@/app/theme";
import type { ActivityItem } from "../types";
import { formatDistanceToNow } from "date-fns";

type ActivityTimelineProps = {
   activities: ActivityItem[];
};

const iconMap = {
   match: <WorkOutlineIcon fontSize="small" />,
   appointment: <CalendarTodayOutlinedIcon fontSize="small" />,
   milestone: <EmojiEventsOutlinedIcon fontSize="small" />,
   message: <ChatOutlinedIcon fontSize="small" />,
};

const colorMap = {
   match: tokens.color.primary[700],
   appointment: tokens.color.info,
   milestone: tokens.color.success,
   message: tokens.color.warning,
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
   return (
      <Card
         sx={{
            p: 3,
            height: "100%",
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
         <Stack spacing={3}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
               Recent Activity
            </Typography>

            <Stack spacing={2.5}>
               {activities.map((activity, index) => {
                  const isLast = index === activities.length - 1;
                  return (
                     <Box
                        key={activity.id}
                        sx={{
                           display: "flex",
                           gap: 2,
                           position: "relative",
                           pb: isLast ? 0 : 2.5,
                        }}
                     >
                        {/* Timeline line */}
                        {!isLast && (
                           <Box
                              sx={{
                                 position: "absolute",
                                 left: 16,
                                 top: 40,
                                 width: 2,
                                 height: "calc(100% - 16px)",
                                 backgroundColor: tokens.color.border,
                              }}
                           />
                        )}

                        {/* Icon */}
                        <Avatar
                           sx={{
                              width: 32,
                              height: 32,
                              bgcolor: `${colorMap[activity.type]}15`,
                              color: colorMap[activity.type],
                              fontSize: 18,
                           }}
                        >
                           {iconMap[activity.type]}
                        </Avatar>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                           <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 0.25 }}
                           >
                              {activity.title}
                           </Typography>
                           <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                           >
                              {activity.description}
                           </Typography>
                           <Typography
                              variant="caption"
                              sx={{
                                 color: tokens.color.text.muted,
                                 fontSize: "0.6875rem",
                              }}
                           >
                              {formatDistanceToNow(activity.timestamp, {
                                 addSuffix: true,
                              })}
                           </Typography>
                        </Box>
                     </Box>
                  );
               })}
            </Stack>
         </Stack>
      </Card>
   );
}
