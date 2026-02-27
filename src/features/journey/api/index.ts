import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { mockDelay } from "@/api/mock-helpers";
import { formatDate } from "@/shared/utils/formatters";
import type { JourneyData, JourneyStep, JourneySummary } from "../types";
import type { JourneyStage } from "@/features/dashboard/types";

export const formatJourneyDate = formatDate;

/**
 * SINGLE SOURCE OF TRUTH for journey steps.
 * Used by both the Dashboard widget and the Journey Tracking page.
 * Step labels and order here are canonical — do not duplicate in dashboard.
 */
const mockJourneySteps: JourneyStep[] = [
   {
      id: "step-1",
      title: "Profile Setup",
      description:
         "Welcome! Your student profile has been successfully created. Complete your profile to increase your chances of matching with companies.",
      status: "completed",
      date: "2026-01-10",
      completedAt: "2026-01-10T09:30:00Z",
      notes: "Profile created successfully. All basic information added.",
      order: 1,
      actions: [
         {
            id: "action-1-1",
            label: "View Profile",
            type: "navigate",
            path: "/profile",
         },
      ],
   },
   {
      id: "step-2",
      title: "CV Upload",
      description:
         "Upload your curriculum vitae to showcase your skills, education, and experience to potential employers.",
      status: "completed",
      date: "2026-01-15",
      completedAt: "2026-01-15T14:20:00Z",
      notes: "CV uploaded: John_Smith_Resume.pdf (1.2 MB)",
      requiredDocuments: ["Curriculum Vitae (PDF/DOC/DOCX)"],
      order: 2,
      actions: [
         {
            id: "action-2-1",
            label: "Manage CV",
            type: "navigate",
            path: "/cv",
         },
      ],
   },
   {
      id: "step-3",
      title: "Company Matching",
      description:
         "We're matching your profile with companies that align with your skills, interests, and career goals. Review and apply to recommended matches.",
      status: "in_progress",
      date: "2026-01-22",
      notes: "5 companies matched. Review your matches and apply to positions that interest you.",
      advisorNotes:
         "You have excellent matches! Focus on TechCorp and InnovateLabs - they're actively hiring students with your background.",
      order: 3,
      actions: [
         {
            id: "action-3-1",
            label: "View Matches",
            type: "navigate",
            path: "/matching",
         },
         {
            id: "action-3-2",
            label: "Schedule Advisor Call",
            type: "navigate",
            path: "/appointments",
         },
      ],
   },
   {
      id: "step-4",
      title: "Applications",
      description:
         "Submit applications to your matched companies. Track application status and respond promptly to any requests.",
      status: "pending",
      requiredDocuments: [
         "Cover Letter (optional)",
         "Portfolio/GitHub (optional)",
      ],
      order: 4,
      actions: [
         {
            id: "action-4-1",
            label: "View Applications",
            type: "navigate",
            path: "/matching",
         },
      ],
   },
   {
      id: "step-5",
      title: "Interviews",
      description:
         "Prepare for your interviews! Review company information, practice common questions, and arrive on time.",
      status: "pending",
      advisorNotes:
         "Interview preparation resources available. Book a mock interview session if you'd like practice.",
      order: 5,
      actions: [
         {
            id: "action-5-1",
            label: "View Schedule",
            type: "navigate",
            path: "/appointments",
         },
         {
            id: "action-5-2",
            label: "Interview Tips",
            type: "navigate",
            path: "/resources",
         },
      ],
   },
   {
      id: "step-6",
      title: "Offer Received",
      description:
         "Congratulations! You've received a placement offer. Review the terms and conditions carefully before accepting.",
      status: "pending",
      requiredDocuments: ["Signed Offer Letter", "Work Authorization"],
      order: 6,
   },
   {
      id: "step-7",
      title: "Placement",
      description:
         "Your placement has been confirmed! Complete pre-arrival requirements and prepare for your journey.",
      status: "pending",
      requiredDocuments: [
         "Visa/Work Permit",
         "Accommodation Confirmation",
         "Travel Arrangements",
      ],
      order: 7,
      actions: [
         {
            id: "action-7-1",
            label: "Pre-Arrival Checklist",
            type: "external",
            url: "",
         },
      ],
   },
   {
      id: "step-8",
      title: "On-Site Integration",
      description:
         "Welcome to your placement! Settle in, meet your team, and begin your professional journey. Stay connected with us for support.",
      status: "pending",
      order: 8,
      actions: [
         {
            id: "action-8-1",
            label: "Contact Support",
            type: "navigate",
            path: "/messaging",
         },
      ],
   },
];

const mockGetJourneyData = async (): Promise<JourneyData> => {
   await mockDelay(600);

   const steps = mockJourneySteps.sort((a, b) => a.order - b.order);
   const completedSteps = steps.filter((s) => s.status === "completed");
   const currentStep = steps.find((s) => s.status === "in_progress") || null;
   const totalSteps = steps.length;
   const completedCount = completedSteps.length;
   const progressPercentage = Math.round(
      (completedCount / totalSteps) * 100
   );

   const summary: JourneySummary = {
      totalSteps,
      completedSteps: completedCount,
      currentStep,
      progressPercentage,
      nextAction: currentStep?.actions?.[0]?.label || "Continue your journey",
   };

   return {
      summary,
      steps,
   };
};

/**
 * Get full journey data including summary and all steps
 */
export async function getJourneyData(): Promise<JourneyData> {
   if (isMock()) return mockGetJourneyData();
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   return api.request<JourneyData>(endpoints.journey.data, { method: "GET" });
}

/**
 * Get journey summary only (lightweight)
 */
export async function getJourneySummary(): Promise<JourneySummary> {
   const data = await getJourneyData();
   return data.summary;
}

/**
 * Update a journey step (for future use)
 */
export async function updateJourneyStep(
   stepId: string,
   updates: Partial<JourneyStep>
): Promise<JourneyStep> {
   if (isMock()) {
      await mockDelay(400);
      const step = mockJourneySteps.find((s) => s.id === stepId);
      if (!step) throw new Error("Step not found");
      return { ...step, ...updates };
   }
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   return api.request<JourneyStep>(endpoints.journey.updateStep(stepId), { method: "PATCH", json: updates });
}

/**
 * Get status color
 */
export function getStatusColor(status: JourneyStep["status"]): string {
   switch (status) {
      case "completed":
         return "#0C7779"; // tokens.color.success
      case "in_progress":
         return "#249E94"; // tokens.color.primary[500]
      case "pending":
         return "#6B7280"; // tokens.color.text.muted
      case "blocked":
         return "#f02929"; // tokens.color.error
      default:
         return "#6B7280";
   }
}

/**
 * Get status label
 */
export function getStatusLabel(status: JourneyStep["status"]): string {
   switch (status) {
      case "completed":
         return "Completed";
      case "in_progress":
         return "In Progress";
      case "pending":
         return "Pending";
      case "blocked":
         return "Blocked";
      default:
         return "Unknown";
   }
}

/**
 * Convert JourneyStep[] to JourneyStage[] for the dashboard compact stepper.
 * This keeps the Dashboard widget in sync with the Journey page.
 */
export function toJourneyStages(steps: JourneyStep[]): JourneyStage[] {
   return steps.map((step) => ({
      id: step.id,
      label: step.title,
      completed: step.status === "completed",
      current: step.status === "in_progress",
   }));
}

/**
 * Get journey stages for the dashboard compact stepper.
 * Single source of truth — dashboard calls this instead of its own mock.
 */
export async function getJourneyProgress(): Promise<JourneyStage[]> {
   const data = await getJourneyData();
   return toJourneyStages(data.steps);
}
