export type User = { id: string; fullName: string; email: string };

export type Education = {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
};

export type StudentProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  school?: string;
  country?: string;
  skills: string[];
  languages: string[];
  education: Education[];
  experience: Experience[];
  preferences?: { location?: string; internshipType?: string };
  updatedAt: string;
};

export type CvMeta = { fileName: string; size: number; uploadedAt: string };

export type CompanyMatch = {
  id: string;
  name: string;
  location: string;
  industry: string;
  matchScore: number; // 0..100
  reason: string;
};

export type Appointment = {
  id: string;
  advisorName: string;
  startAt: string; // ISO
  endAt: string;   // ISO
  status: "upcoming" | "completed" | "canceled";
};

export type MessageThread = {
  id: string;
  title: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  sender: "student" | "advisor";
  text: string;
  sentAt: string;
};

export type JourneyStep = {
  id: string;
  title: string;
  status: "done" | "in_progress" | "todo";
  date?: string;
  description?: string;
};

export type ResourceItem = {
  id: string;
  category: "housing" | "integration" | "community";
  title: string;
  summary: string;
  content: string;
};
