export type NotificationType = "info" | "success" | "warning";

export type Notification = {
   id: string;
   title: string;
   message: string;
   type: NotificationType;
   createdAt: string; // ISO
   read: boolean;
   link?: string; // optional route to navigate to on click
};

export type NotificationFilter = "all" | "unread" | "read";

export type GetNotificationsParams = {
   filter?: NotificationFilter;
};
