import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { mockDelay } from "@/api/mock-helpers";
import type { Notification, GetNotificationsParams } from "../types";

// ─── Mutable mock state ───────────────────────────────────────────────────────
// Using an array that mutation functions operate on, simulating a real store.

let mockNotifications: Notification[] = [
   {
      id: "notif-1",
      title: "New match found!",
      message:
         "TechCorp International is a 92% match for your profile. Check it out before applications close.",
      type: "success",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      read: false,
      link: "/matching",
   },
   {
      id: "notif-2",
      title: "Appointment confirmed",
      message:
         "Your appointment with Sophie Martin on Feb 28 at 10:00 AM has been confirmed.",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      read: false,
      link: "/appointments",
   },
   {
      id: "notif-3",
      title: "Advisor replied",
      message:
         'James Okafor replied: "Please bring your transcript to the next meeting."',
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
      read: false,
      link: "/messaging",
   },
   {
      id: "notif-4",
      title: "Journey step updated",
      message:
         'Your journey step "CV Review" has been marked as completed by your advisor.',
      type: "success",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
      read: false,
      link: "/journey",
   },
   {
      id: "notif-5",
      title: "New resource available",
      message:
         '"How to ace your internship interview" has been added to the Resources library.',
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2d ago
      read: true,
      link: "/resources",
   },
   {
      id: "notif-6",
      title: "Profile incomplete",
      message:
         "Your profile is 65% complete. Add your experience to improve your match score.",
      type: "warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3d ago
      read: true,
      link: "/profile",
   },
   {
      id: "notif-7",
      title: "Application deadline approaching",
      message:
         "GlobalLogic Internship deadline is in 3 days. Don't miss your chance to apply.",
      type: "warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4d ago
      read: true,
      link: "/matching",
   },
];

// ─── Mock implementations ─────────────────────────────────────────────────────

const mockGetNotifications = async (
   params?: GetNotificationsParams,
): Promise<Notification[]> => {
   await mockDelay(400);
   const filter = params?.filter ?? "all";
   if (filter === "unread") return mockNotifications.filter((n) => !n.read);
   if (filter === "read") return mockNotifications.filter((n) => n.read);
   return [...mockNotifications];
};

const mockGetUnreadCount = async (): Promise<number> => {
   await mockDelay(200);
   return mockNotifications.filter((n) => !n.read).length;
};

const mockMarkAsRead = async (id: string): Promise<void> => {
   await mockDelay(150);
   mockNotifications = mockNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
   );
};

const mockMarkAllAsRead = async (): Promise<void> => {
   await mockDelay(300);
   mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
};

const mockClearNotification = async (id: string): Promise<void> => {
   await mockDelay(150);
   mockNotifications = mockNotifications.filter((n) => n.id !== id);
};

const mockClearAll = async (): Promise<void> => {
   await mockDelay(300);
   mockNotifications = [];
};

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getNotifications(
   params?: GetNotificationsParams,
): Promise<Notification[]> {
   if (isMock()) return mockGetNotifications(params);
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   const query = params?.filter && params.filter !== "all" ? `?filter=${params.filter}` : "";
   return api.request<Notification[]>(`${endpoints.notifications.list}${query}`, { method: "GET" });
}

export async function getUnreadCount(): Promise<number> {
   if (isMock()) return mockGetUnreadCount();
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   const res = await api.request<{ count: number }>(endpoints.notifications.unreadCount, { method: "GET" });
   return res.count;
}

export async function markAsRead(id: string): Promise<void> {
   if (isMock()) return mockMarkAsRead(id);
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   await api.request<void>(endpoints.notifications.markRead(id), { method: "PATCH" });
}

export async function markAllAsRead(): Promise<void> {
   if (isMock()) return mockMarkAllAsRead();
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   await api.request<void>(endpoints.notifications.markAllRead, { method: "PATCH" });
}

export async function clearNotification(id: string): Promise<void> {
   if (isMock()) return mockClearNotification(id);
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   await api.request<void>(endpoints.notifications.clear(id), { method: "DELETE" });
}

export async function clearAll(): Promise<void> {
   if (isMock()) return mockClearAll();
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   await api.request<void>(endpoints.notifications.clearAll, { method: "DELETE" });
}
