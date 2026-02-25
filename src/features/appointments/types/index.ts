export type AppointmentType = "Online" | "On-site";

export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

export interface Advisor {
   id: string;
   name: string;
   role: string;
   avatarInitials: string;
}

export interface Appointment {
   id: string;
   advisorId: string;
   advisorName: string;
   advisorRole: string;
   /** ISO datetime string */
   dateTime: string;
   /** Duration in minutes */
   duration: number;
   type: AppointmentType;
   status: AppointmentStatus;
   /** Zoom/Teams link for Online; room name/address for On-site */
   locationOrLink: string;
   notes?: string;
   /** ISO datetime string */
   createdAt: string;
}

export interface BookingPayload {
   advisorId: string;
   /** ISO date string e.g. "2026-03-10" */
   date: string;
   /** e.g. "10:00" */
   timeSlot: string;
   type: AppointmentType;
   notes?: string;
}

export interface ReschedulePayload {
   /** ISO date string */
   date: string;
   timeSlot: string;
}

export type AppointmentTab = "upcoming" | "past" | "all";
