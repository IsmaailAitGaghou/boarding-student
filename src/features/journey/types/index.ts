export type JourneyStepStatus =
   | "completed"
   | "in_progress"
   | "pending"
   | "blocked";

export interface JourneyStep {
   id: string;
   title: string;
   description: string;
   status: JourneyStepStatus;
   date?: string; // ISO date string
   completedAt?: string; // ISO date string
   notes?: string;
   advisorNotes?: string;
   requiredDocuments?: string[];
   actions?: JourneyAction[];
   order: number;
}

export interface JourneyAction {
   id: string;
   label: string;
   type: "navigate" | "upload" | "schedule" | "external";
   path?: string; // for navigate type
   url?: string; // for external type
   icon?: string;
}

export interface JourneySummary {
   totalSteps: number;
   completedSteps: number;
   currentStep: JourneyStep | null;
   progressPercentage: number;
   nextAction?: string;
}

export interface JourneyData {
   summary: JourneySummary;
   steps: JourneyStep[];
}
