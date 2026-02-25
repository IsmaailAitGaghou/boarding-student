import { isMock } from "@/api/env";
import type {
   Appointment,
   Advisor,
   BookingPayload,
   ReschedulePayload,
} from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Mock advisors ────────────────────────────────────────────────────────────
export const mockAdvisors: Advisor[] = [
   { id: "adv-1", name: "Sophie Martin",   role: "Career Advisor",      avatarInitials: "SM" },
   { id: "adv-2", name: "James Okafor",    role: "Academic Advisor",    avatarInitials: "JO" },
   { id: "adv-3", name: "Lena Fischer",    role: "Internship Advisor",  avatarInitials: "LF" },
   { id: "adv-4", name: "Carlos Reyes",    role: "Placement Advisor",   avatarInitials: "CR" },
];

// ─── Mock appointments (in-memory mutable state) ─────────────────────────────
const _base: Omit<Appointment, "id" | "createdAt">[] = [
   {
      advisorId: "adv-1",
      advisorName: "Sophie Martin",
      advisorRole: "Career Advisor",
      dateTime: "2026-03-05T10:00:00Z",
      duration: 30,
      type: "Online",
      status: "Scheduled",
      locationOrLink: "https://zoom.us/j/111222333",
      notes: "Discuss internship options for summer 2026.",
   },
   {
      advisorId: "adv-2",
      advisorName: "James Okafor",
      advisorRole: "Academic Advisor",
      dateTime: "2026-03-12T14:00:00Z",
      duration: 45,
      type: "On-site",
      status: "Scheduled",
      locationOrLink: "Room 204, Building B",
      notes: "Review transcript and course plan.",
   },
   {
      advisorId: "adv-3",
      advisorName: "Lena Fischer",
      advisorRole: "Internship Advisor",
      dateTime: "2026-03-20T09:30:00Z",
      duration: 30,
      type: "Online",
      status: "Scheduled",
      locationOrLink: "https://teams.microsoft.com/l/meetup-join/abc123",
   },
   {
      advisorId: "adv-1",
      advisorName: "Sophie Martin",
      advisorRole: "Career Advisor",
      dateTime: "2026-02-10T11:00:00Z",
      duration: 30,
      type: "Online",
      status: "Completed",
      locationOrLink: "https://zoom.us/j/444555666",
      notes: "Reviewed CV and cover letter. Student needs to tailor for tech roles.",
   },
   {
      advisorId: "adv-4",
      advisorName: "Carlos Reyes",
      advisorRole: "Placement Advisor",
      dateTime: "2026-01-28T15:30:00Z",
      duration: 60,
      type: "On-site",
      status: "Completed",
      locationOrLink: "Room 101, Building A",
      notes: "Discussed placement readiness. Recommended two companies.",
   },
   {
      advisorId: "adv-2",
      advisorName: "James Okafor",
      advisorRole: "Academic Advisor",
      dateTime: "2026-01-15T10:00:00Z",
      duration: 30,
      type: "Online",
      status: "Cancelled",
      locationOrLink: "https://zoom.us/j/777888999",
      notes: "Cancelled by student due to scheduling conflict.",
   },
   {
      advisorId: "adv-3",
      advisorName: "Lena Fischer",
      advisorRole: "Internship Advisor",
      dateTime: "2026-02-20T14:00:00Z",
      duration: 45,
      type: "On-site",
      status: "Completed",
      locationOrLink: "Room 310, Building C",
   },
   {
      advisorId: "adv-4",
      advisorName: "Carlos Reyes",
      advisorRole: "Placement Advisor",
      dateTime: "2026-02-01T09:00:00Z",
      duration: 30,
      type: "Online",
      status: "Cancelled",
      locationOrLink: "https://zoom.us/j/321654987",
      notes: "Rescheduled to a later date.",
   },
];

const mockAppointmentsState: Appointment[] = _base.map((a, i) => ({
   ...a,
   id: `apt-${i + 1}`,
   createdAt: new Date(Date.now() - (i + 1) * 86_400_000 * 3).toISOString(),
}));

let _nextId = mockAppointmentsState.length + 1;

// ─── Mock time slots ──────────────────────────────────────────────────────────
const ALL_SLOTS = [
   "09:00", "09:30", "10:00", "10:30",
   "11:00", "11:30", "13:00", "13:30",
   "14:00", "14:30", "15:00", "15:30",
   "16:00",
];

// ─── API functions ─────────────────────────────────────────────────────────────

export async function getAppointments(): Promise<Appointment[]> {
   if (isMock()) {
      await sleep(600);
      return [...mockAppointmentsState];
   }
   // TODO: return apiClient.get<Appointment[]>("/appointments");
   throw new Error("Real API not implemented");
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
   if (isMock()) {
      await sleep(250);
      return mockAppointmentsState.find((a) => a.id === id) ?? null;
   }
   // TODO: return apiClient.get<Appointment>(`/appointments/${id}`);
   throw new Error("Real API not implemented");
}

export async function bookAppointment(payload: BookingPayload): Promise<Appointment> {
   if (isMock()) {
      await sleep(800);
      const advisor = mockAdvisors.find((a) => a.id === payload.advisorId);
      if (!advisor) throw new Error("Advisor not found");

      const [hour, minute] = payload.timeSlot.split(":").map(Number);
      const dt = new Date(`${payload.date}T00:00:00Z`);
      dt.setUTCHours(hour, minute, 0, 0);

      const newAppointment: Appointment = {
         id: `apt-${_nextId++}`,
         advisorId: advisor.id,
         advisorName: advisor.name,
         advisorRole: advisor.role,
         dateTime: dt.toISOString(),
         duration: 30,
         type: payload.type,
         status: "Scheduled",
         locationOrLink:
            payload.type === "Online"
               ? "https://zoom.us/j/meeting-link-generated"
               : "Room TBD — advisor will confirm",
         notes: payload.notes,
         createdAt: new Date().toISOString(),
      };
      mockAppointmentsState.unshift(newAppointment);
      return { ...newAppointment };
   }
   // TODO: return apiClient.post<Appointment>("/appointments", { json: payload });
   throw new Error("Real API not implemented");
}

export async function rescheduleAppointment(
   id: string,
   payload: ReschedulePayload,
): Promise<Appointment> {
   if (isMock()) {
      await sleep(600);
      const idx = mockAppointmentsState.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Appointment not found");

      const [hour, minute] = payload.timeSlot.split(":").map(Number);
      const dt = new Date(`${payload.date}T00:00:00Z`);
      dt.setUTCHours(hour, minute, 0, 0);

      mockAppointmentsState[idx] = {
         ...mockAppointmentsState[idx],
         dateTime: dt.toISOString(),
         status: "Scheduled",
      };
      return { ...mockAppointmentsState[idx] };
   }
   // TODO: return apiClient.patch<Appointment>(`/appointments/${id}/reschedule`, { json: payload });
   throw new Error("Real API not implemented");
}

export async function cancelAppointment(id: string): Promise<Appointment> {
   if (isMock()) {
      await sleep(500);
      const idx = mockAppointmentsState.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Appointment not found");
      mockAppointmentsState[idx] = {
         ...mockAppointmentsState[idx],
         status: "Cancelled",
      };
      return { ...mockAppointmentsState[idx] };
   }
   // TODO: return apiClient.patch<Appointment>(`/appointments/${id}/cancel`);
   throw new Error("Real API not implemented");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAdvisors(): Advisor[] {
   return [...mockAdvisors];
}

export function getTimeSlots(
   date: string,
   advisorId: string,
): string[] {
   // In a real API this would query available slots for advisor + date.
   // These params are reserved for real API integration.
   void date;
   void advisorId;
   const taken = ["10:30", "14:00"];
   return ALL_SLOTS.filter((s) => !taken.includes(s));
}

export function isUpcoming(apt: Appointment): boolean {
   return new Date(apt.dateTime) > new Date() && apt.status === "Scheduled";
}

export function isPast(apt: Appointment): boolean {
   return (
      new Date(apt.dateTime) <= new Date() ||
      apt.status === "Completed" ||
      apt.status === "Cancelled"
   );
}
