export type MatchType =
   | "Internship"
   | "Apprenticeship"
   | "Part-time"
   | "Full-time";

export type MatchStatus = "new" | "saved" | "applied" | "interviewing";

export interface Match {
   id: string;
   companyName: string;
   companyIndustry: string;
   companySize: string; // e.g. "50–200 employees"
   companyDescription: string;
   role: string;
   location: string;
   type: MatchType;
   matchScore: number; // 0–100
   tags: string[]; // e.g. ["React", "TypeScript", "Remote"]
   description: string; // short 1–2 line description
   saved: boolean;
   applied: boolean;
   status: MatchStatus;
   startDate?: string; // ISO date string
   createdAt: string; // ISO date string
   // Details (shown in drawer)
   requirements: string[];
   responsibilities: string[];
   matchReasons: string[]; // "Why it matches" list
   salary?: string; // e.g. "$2,000/month"
   logo?: string;
}

export interface MatchFilters {
   search: string;
   location: string; // "" = all
   industry: string; // "" = all
   type: MatchType | ""; // "" = all
   minScore: number; // 0, 60, 75, 90
   status: "all" | "saved" | "applied";
   sort: "score" | "recent" | "location";
}

export type MatchSortOption = {
   value: MatchFilters["sort"];
   label: string;
};

