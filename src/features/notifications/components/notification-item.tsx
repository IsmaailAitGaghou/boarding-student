import { Box, Typography, Chip, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "@/app/theme";
import type { Notification } from "../types";

type NotificationItemProps = {
   notification: Notification;
   onClick: (notification: Notification) => void;
   onClear?: (id: string) => void;
   compact?: boolean; // true = panel mode (smaller padding)
};

const TYPE_CONFIG = {
   info: {
      icon: InfoOutlinedIcon,
      color: tokens.color.info,
      label: "Info",
   },
   success: {
      icon: CheckCircleOutlineIcon,
      color: tokens.color.success,
      label: "Success",
   },
   warning: {
      icon: WarningAmberOutlinedIcon,
      color: tokens.color.warning,
      label: "Alert",
   },
} as const;

function formatRelativeTime(isoString: string): string {
   const diffMs = Date.now() - new Date(isoString).getTime();
   const diffSec = Math.floor(diffMs / 1000);
   if (diffSec < 60) return "Just now";
   const diffMin = Math.floor(diffSec / 60);
   if (diffMin < 60) return `${diffMin}m ago`;
   const diffH = Math.floor(diffMin / 60);
   if (diffH < 24) return `${diffH}h ago`;
   const diffD = Math.floor(diffH / 24);
   if (diffD < 7) return `${diffD}d ago`;
   return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
   });
}

export function NotificationItem({
   notification,
   onClick,
   onClear,
   compact = false,
}: NotificationItemProps) {
   const config = TYPE_CONFIG[notification.type];
   const TypeIcon = config.icon;

   return (
      <Box
         onClick={() => onClick(notification)}
         sx={{
            display: "flex",
            gap: 1.5,
            p: compact ? 1.5 : 2,
            cursor: "pointer",
            position: "relative",
            backgroundColor: notification.read
               ? "transparent"
               : alpha(tokens.color.primary[700], 0.03),
            borderLeft: notification.read
               ? "3px solid transparent"
               : `3px solid ${tokens.color.primary[700]}`,
            transition: "background-color 150ms ease",
            "&:hover": {
               backgroundColor: alpha(tokens.color.primary[700], 0.05),
            },
         }}
      >
         {/* Type icon */}
         <Box
            sx={{
               width: 36,
               height: 36,
               borderRadius: "50%",
               backgroundColor: alpha(config.color, 0.1),
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               flexShrink: 0,
               mt: 0.25,
            }}
         >
            <TypeIcon sx={{ fontSize: 18, color: config.color }} />
         </Box>

         {/* Content */}
         <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 1,
                  mb: 0.25,
               }}
            >
               <Typography
                  variant="body2"
                  sx={{
                     fontWeight: notification.read ? 500 : 700,
                     color: tokens.color.text.primary,
                     lineHeight: 1.4,
                     flex: 1,
                     minWidth: 0,
                  }}
               >
                  {notification.title}
               </Typography>

               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 0.5,
                     flexShrink: 0,
                  }}
               >
                  {!notification.read && (
                     <Box
                        sx={{
                           width: 7,
                           height: 7,
                           borderRadius: "50%",
                           backgroundColor: tokens.color.primary[700],
                           flexShrink: 0,
                        }}
                     />
                  )}
                  {onClear && (
                     <IconButton
                        size="small"
                        onClick={(e) => {
                           e.stopPropagation();
                           onClear(notification.id);
                        }}
                        sx={{
                           p: 0.25,
                           color: tokens.color.text.muted,
                           "&:hover": {
                              color: tokens.color.error,
                              backgroundColor: alpha(tokens.color.error, 0.08),
                           },
                        }}
                     >
                        <CloseIcon sx={{ fontSize: 14 }} />
                     </IconButton>
                  )}
               </Box>
            </Box>

            <Typography
               variant="caption"
               sx={{
                  color: tokens.color.text.secondary,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                  mb: 0.75,
               }}
            >
               {notification.message}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Chip
                  label={config.label}
                  size="small"
                  sx={{
                     height: 18,
                     fontSize: "0.65rem",
                     fontWeight: 600,
                     backgroundColor: alpha(config.color, 0.1),
                     color: config.color,
                     "& .MuiChip-label": { px: 0.75 },
                  }}
               />
               <Typography
                  variant="caption"
                  sx={{
                     color: tokens.color.text.muted,
                     fontSize: "0.7rem",
                  }}
               >
                  {formatRelativeTime(notification.createdAt)}
               </Typography>
            </Box>
         </Box>
      </Box>
   );
}
