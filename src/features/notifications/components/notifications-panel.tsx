import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
   Popover,
   Box,
   Typography,
   Button,
   Divider,
   Tab,
   Tabs,
   CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { tokens } from "@/app/theme";
import { getNotifications, markAsRead, markAllAsRead } from "../api";
import { NotificationItem } from "./notification-item";
import type { Notification, NotificationFilter } from "../types";

type NotificationsPanelProps = {
   anchorEl: HTMLElement | null;
   open: boolean;
   onClose: () => void;
   onUnreadCountChange: (count: number) => void;
};

export function NotificationsPanel({
   anchorEl,
   open,
   onClose,
   onUnreadCountChange,
}: NotificationsPanelProps) {
   const navigate = useNavigate();
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [loading, setLoading] = useState(false);
   const [markingAll, setMarkingAll] = useState(false);
   const [filter, setFilter] = useState<NotificationFilter>("all");

   const load = useCallback(
      async (f: NotificationFilter) => {
         setLoading(true);
         try {
            const data = await getNotifications({ filter: f });
            setNotifications(data);
            // Update badge — always computed from "all"
            const all = f === "all" ? data : await getNotifications();
            onUnreadCountChange(all.filter((n) => !n.read).length);
         } finally {
            setLoading(false);
         }
      },
      [onUnreadCountChange],
   );

   // Reload when panel opens or filter changes
   useEffect(() => {
      if (open) {
         void load(filter);
      }
   }, [open, filter, load]);

   const handleTabChange = (
      _: React.SyntheticEvent,
      val: NotificationFilter,
   ) => {
      setFilter(val);
   };

   const handleClick = async (notification: Notification) => {
      if (!notification.read) {
         await markAsRead(notification.id);
         setNotifications((prev) =>
            prev.map((n) =>
               n.id === notification.id ? { ...n, read: true } : n,
            ),
         );
         onUnreadCountChange(
            notifications.filter((n) => !n.read && n.id !== notification.id)
               .length,
         );
      }
      if (notification.link) {
         onClose();
         navigate(notification.link);
      }
   };

   const handleMarkAll = async () => {
      setMarkingAll(true);
      try {
         await markAllAsRead();
         await load(filter);
      } finally {
         setMarkingAll(false);
      }
   };

   const handleViewAll = () => {
      onClose();
      navigate("/notifications");
   };

   const unreadCount = notifications.filter((n) => !n.read).length;

   return (
      <Popover
         open={open}
         anchorEl={anchorEl}
         onClose={onClose}
         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         transformOrigin={{ vertical: "top", horizontal: "right" }}
         PaperProps={{
            sx: {
               mt: 1.5,
               width: 400,
               maxWidth: "calc(100vw - 32px)",
               borderRadius: `${tokens.radius.card}px`,
               boxShadow: tokens.shadow.md,
               border: `1px solid ${tokens.color.border}`,
               overflow: "hidden",
            },
         }}
      >
         {/* Header */}
         <Box
            sx={{
               px: 2.5,
               pt: 2,
               pb: 1.5,
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Notifications
               </Typography>
               {unreadCount > 0 && (
                  <Box
                     sx={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: tokens.color.primary[700],
                        color: "#fff",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 0.75,
                     }}
                  >
                     {unreadCount}
                  </Box>
               )}
            </Box>

            <Button
               size="small"
               onClick={handleMarkAll}
               disabled={markingAll || unreadCount === 0}
               sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: tokens.color.primary[700],
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                  },
               }}
            >
               {markingAll ? (
                  <CircularProgress size={12} sx={{ mr: 0.5 }} />
               ) : null}
               Mark all as read
            </Button>
         </Box>

         {/* Tabs */}
         <Box sx={{ px: 2, borderBottom: `1px solid ${tokens.color.border}` }}>
            <Tabs
               value={filter}
               onChange={handleTabChange}
               sx={{
                  minHeight: 38,
                  "& .MuiTab-root": {
                     minHeight: 38,
                     py: 0,
                     fontSize: "0.8125rem",
                     textTransform: "none",
                     fontWeight: 500,
                     color: tokens.color.text.muted,
                     "&.Mui-selected": {
                        color: tokens.color.primary[700],
                        fontWeight: 700,
                     },
                  },
                  "& .MuiTabs-indicator": {
                     backgroundColor: tokens.color.primary[700],
                     height: 2,
                  },
               }}
            >
               <Tab label="All" value="all" />
               <Tab label="Unread" value="unread" />
               <Tab label="Read" value="read" />
            </Tabs>
         </Box>

         {/* List */}
         <Box
            sx={{
               maxHeight: 400,
               overflowY: "auto",
               "&::-webkit-scrollbar": { width: 4 },
               "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
               },
               "&::-webkit-scrollbar-thumb": {
                  backgroundColor: tokens.color.border,
                  borderRadius: 2,
               },
            }}
         >
            {loading ? (
               <Box
                  sx={{
                     display: "flex",
                     justifyContent: "center",
                     py: 4,
                  }}
               >
                  <CircularProgress
                     size={24}
                     sx={{ color: tokens.color.primary[700] }}
                  />
               </Box>
            ) : notifications.length === 0 ? (
               <Box
                  sx={{
                     textAlign: "center",
                     py: 5,
                     px: 3,
                  }}
               >
                  <NotificationsNoneIcon
                     sx={{
                        fontSize: 40,
                        color: tokens.color.text.muted,
                        mb: 1,
                     }}
                  />
                  <Typography variant="body2" color="text.secondary">
                     {filter === "unread"
                        ? "No unread notifications"
                        : filter === "read"
                        ? "No read notifications"
                        : "No notifications yet"}
                  </Typography>
               </Box>
            ) : (
               notifications.map((notif, idx) => (
                  <Box key={notif.id}>
                     <NotificationItem
                        notification={notif}
                        onClick={handleClick}
                        compact
                     />
                     {idx < notifications.length - 1 && (
                        <Divider sx={{ mx: 0 }} />
                     )}
                  </Box>
               ))
            )}
         </Box>

         {/* Footer */}
         <Divider />
         <Box sx={{ p: 1.5, textAlign: "center" }}>
            <Button
               fullWidth
               size="small"
               onClick={handleViewAll}
               sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: tokens.color.primary[700],
                  borderRadius: `${tokens.radius.control}px`,
                  "&:hover": {
                     backgroundColor: alpha(tokens.color.primary[700], 0.06),
                  },
               }}
            >
               View all notifications
            </Button>
         </Box>
      </Popover>
   );
}
