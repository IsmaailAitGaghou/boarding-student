import { isMock } from "@/api/env";
import type { Match, MatchFilters } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockMatches: Match[] = [
   {
      id: "m-1",
      companyName: "TechCorp Solutions",
      companyIndustry: "Software & Technology",
      companySize: "500–1,000 employees",
      companyDescription:
         "TechCorp is a fast-growing SaaS company building enterprise tools used by over 2,000 businesses worldwide.",
      role: "Software Engineer Intern",
      location: "San Francisco, CA",
      type: "Internship",
      matchScore: 92,
      tags: ["React", "TypeScript", "Node.js"],
      description:
         "Join our engineering team to build scalable web applications. Work directly with senior engineers on real product features.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-06-01",
      createdAt: "2026-02-10T10:00:00Z",
      requirements: [
         "Currently enrolled in a CS or related degree",
         "Proficiency in JavaScript / TypeScript",
         "Familiarity with React or similar framework",
         "Strong communication skills",
      ],
      responsibilities: [
         "Build and maintain frontend features using React",
         "Collaborate with product and design teams",
         "Write unit and integration tests",
         "Participate in code reviews",
      ],
      matchReasons: [
         "Your TypeScript & React skills match the role requirements",
         "Your university project experience aligns with their product stack",
         "Location preference matches (San Francisco, CA)",
         "Internship type matches your preference",
      ],
      salary: "$3,500 / month",
   },
   {
      id: "m-2",
      companyName: "InnovateLabs",
      companyIndustry: "Design & UX",
      companySize: "50–200 employees",
      companyDescription:
         "InnovateLabs is a design-led product studio creating digital experiences for startups and enterprises.",
      role: "Product Designer Intern",
      location: "New York, NY",
      type: "Internship",
      matchScore: 88,
      tags: ["Figma", "UX Research", "Prototyping"],
      description:
         "Help shape user experiences for multiple client products. Conduct user research, create wireframes, and deliver polished prototypes.",
      saved: true,
      applied: false,
      status: "saved",
      startDate: "2026-05-15",
      createdAt: "2026-02-09T08:00:00Z",
      requirements: [
         "Portfolio demonstrating UX/UI projects",
         "Proficiency in Figma",
         "Understanding of user-centered design",
         "Strong visual design sensibility",
      ],
      responsibilities: [
         "Create wireframes and interactive prototypes",
         "Conduct user interviews and usability testing",
         "Present design concepts to stakeholders",
         "Collaborate with developers for implementation",
      ],
      matchReasons: [
         "Your design coursework aligns with their studio work",
         "Your Figma proficiency matches the tooling requirement",
         "New York matches your preferred location",
      ],
      salary: "$2,800 / month",
   },
   {
      id: "m-3",
      companyName: "DataDrive Inc",
      companyIndustry: "Data & Analytics",
      companySize: "200–500 employees",
      companyDescription:
         "DataDrive helps enterprises unlock value from their data through analytics platforms and consulting services.",
      role: "Data Analyst Intern",
      location: "Austin, TX",
      type: "Internship",
      matchScore: 85,
      tags: ["Python", "SQL", "Tableau"],
      description:
         "Analyze large datasets to generate business insights. Build dashboards and reports for internal stakeholders.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-06-01",
      createdAt: "2026-02-08T12:00:00Z",
      requirements: [
         "Proficiency in Python and SQL",
         "Experience with data visualization tools",
         "Analytical mindset and attention to detail",
         "Statistics or data science coursework",
      ],
      responsibilities: [
         "Query and clean data from multiple sources",
         "Build dashboards in Tableau or Power BI",
         "Present findings to business teams",
         "Support senior analysts on larger projects",
      ],
      matchReasons: [
         "Your Python and SQL skills are a strong match",
         "Data analysis coursework aligns with role requirements",
         "Texas is within your preferred region",
      ],
      salary: "$2,500 / month",
   },
   {
      id: "m-4",
      companyName: "CloudScale",
      companyIndustry: "Cloud & Infrastructure",
      companySize: "1,000–5,000 employees",
      companyDescription:
         "CloudScale provides cloud-native infrastructure solutions, helping enterprises migrate and optimise cloud workloads.",
      role: "DevOps Engineer Intern",
      location: "Seattle, WA",
      type: "Internship",
      matchScore: 78,
      tags: ["Docker", "Kubernetes", "CI/CD"],
      description:
         "Work with the platform team on CI/CD pipelines, container orchestration, and infrastructure automation.",
      saved: false,
      applied: true,
      status: "applied",
      startDate: "2026-07-01",
      createdAt: "2026-02-07T09:00:00Z",
      requirements: [
         "Familiarity with Linux and shell scripting",
         "Basic knowledge of Docker/containers",
         "Interest in cloud platforms (AWS, GCP, Azure)",
         "Problem-solving mindset",
      ],
      responsibilities: [
         "Maintain and improve CI/CD pipelines",
         "Support container deployment with Kubernetes",
         "Automate infrastructure tasks",
         "Monitor system health and resolve incidents",
      ],
      matchReasons: [
         "Your Linux experience matches the baseline requirements",
         "Cloud & infrastructure interest aligns with the team's focus",
         "Seattle is within your travel preference",
      ],
      salary: "$3,200 / month",
   },
   {
      id: "m-5",
      companyName: "AI Ventures",
      companyIndustry: "Artificial Intelligence",
      companySize: "20–50 employees",
      companyDescription:
         "AI Ventures is an early-stage AI startup building next-generation NLP and computer vision products.",
      role: "Machine Learning Intern",
      location: "Boston, MA",
      type: "Internship",
      matchScore: 72,
      tags: ["Python", "PyTorch", "NLP"],
      description:
         "Contribute to ML model development and research. Work alongside PhD researchers on cutting-edge AI projects.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-06-15",
      createdAt: "2026-02-06T11:00:00Z",
      requirements: [
         "Strong Python skills",
         "Exposure to ML frameworks (PyTorch or TensorFlow)",
         "Linear algebra and statistics foundations",
         "Curiosity and self-directed learning",
      ],
      responsibilities: [
         "Train and evaluate ML models",
         "Preprocess and augment datasets",
         "Research new techniques and summarise findings",
         "Write clean, documented code",
      ],
      matchReasons: [
         "Your Python proficiency is a strong match",
         "AI/ML coursework aligns with their research focus",
         "Boston matches your location preference",
      ],
      salary: "$2,600 / month",
   },
   {
      id: "m-6",
      companyName: "FinEdge",
      companyIndustry: "FinTech",
      companySize: "200–500 employees",
      companyDescription:
         "FinEdge builds modern banking infrastructure for challenger banks and payment companies across Europe.",
      role: "Backend Developer Intern",
      location: "London, UK",
      type: "Internship",
      matchScore: 68,
      tags: ["Node.js", "PostgreSQL", "REST APIs"],
      description:
         "Build robust backend services powering financial transactions. Work in an agile team with experienced engineers.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-09-01",
      createdAt: "2026-02-05T14:00:00Z",
      requirements: [
         "Node.js or similar backend experience",
         "Database design knowledge (SQL)",
         "Understanding of REST API principles",
         "Attention to security and reliability",
      ],
      responsibilities: [
         "Design and build REST APIs",
         "Write database queries and migrations",
         "Collaborate on system architecture discussions",
         "Ensure high availability and security",
      ],
      matchReasons: [
         "Your Node.js experience matches their stack",
         "SQL coursework aligns with database requirements",
      ],
      salary: "£2,200 / month",
   },
   {
      id: "m-7",
      companyName: "GreenPath",
      companyIndustry: "CleanTech & Sustainability",
      companySize: "50–200 employees",
      companyDescription:
         "GreenPath is on a mission to make renewable energy accessible. They build software for solar and wind farm operators.",
      role: "Full-Stack Developer Intern",
      location: "Remote",
      type: "Full-time",
      matchScore: 81,
      tags: ["React", "Python", "Remote"],
      description:
         "Help build GreenPath's energy management platform. Fully remote role with flexible hours.",
      saved: true,
      applied: false,
      status: "saved",
      startDate: "2026-04-01",
      createdAt: "2026-02-04T16:00:00Z",
      requirements: [
         "React and Python experience",
         "Comfortable with Git and modern dev workflows",
         "Self-motivated and remote-work ready",
      ],
      responsibilities: [
         "Develop features across the full stack",
         "Participate in daily standups (async friendly)",
         "Review and improve existing codebase",
         "Write documentation for key modules",
      ],
      matchReasons: [
         "React and Python are core skills in your profile",
         "Remote type matches your preference",
         "Mission-driven company aligns with your values",
      ],
      salary: "$3,000 / month",
   },
   {
      id: "m-8",
      companyName: "MediConnect",
      companyIndustry: "HealthTech",
      companySize: "100–500 employees",
      companyDescription:
         "MediConnect connects patients and healthcare providers through a digital-first telehealth platform.",
      role: "Frontend Developer Intern",
      location: "Chicago, IL",
      type: "Part-time",
      matchScore: 74,
      tags: ["React", "Accessibility", "TypeScript"],
      description:
         "Build accessible, patient-facing UI components for a telehealth platform used by thousands of patients daily.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-05-01",
      createdAt: "2026-02-03T10:00:00Z",
      requirements: [
         "React and TypeScript proficiency",
         "Awareness of web accessibility (WCAG)",
         "Attention to detail in UI implementation",
      ],
      responsibilities: [
         "Build and maintain React components",
         "Ensure WCAG AA accessibility compliance",
         "Work with designers on responsive layouts",
      ],
      matchReasons: [
         "Your React and TypeScript skills match perfectly",
         "Part-time type fits your schedule",
         "Healthcare impact aligns with your interests",
      ],
      salary: "$1,800 / month",
   },
   {
      id: "m-9",
      companyName: "ShopSmart",
      companyIndustry: "E-Commerce",
      companySize: "1,000+ employees",
      companyDescription:
         "ShopSmart is a leading e-commerce platform powering 50,000+ online stores.",
      role: "Software Engineering Apprentice",
      location: "Los Angeles, CA",
      type: "Apprenticeship",
      matchScore: 66,
      tags: ["Java", "Spring Boot", "Microservices"],
      description:
         "A structured 12-month apprenticeship building backend services for ShopSmart's e-commerce platform.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-08-01",
      createdAt: "2026-02-02T09:00:00Z",
      requirements: [
         "Basic Java or backend language experience",
         "Willingness to learn and grow",
         "Team collaboration skills",
      ],
      responsibilities: [
         "Learn and contribute to microservices development",
         "Pair programme with senior developers",
         "Complete structured learning milestones",
      ],
      matchReasons: [
         "Apprenticeship type matches your programme",
         "LA is within your location preferences",
      ],
      salary: "$2,200 / month",
   },
   {
      id: "m-10",
      companyName: "EduPlatform",
      companyIndustry: "EdTech",
      companySize: "20–50 employees",
      companyDescription:
         "EduPlatform builds adaptive learning tools for K–12 and university students worldwide.",
      role: "React Developer Intern",
      location: "Remote",
      type: "Internship",
      matchScore: 79,
      tags: ["React", "GraphQL", "Remote"],
      description:
         "Build interactive learning modules for students using React and GraphQL. Fully remote and mission-driven.",
      saved: false,
      applied: false,
      status: "new",
      startDate: "2026-05-01",
      createdAt: "2026-02-01T08:00:00Z",
      requirements: [
         "React proficiency",
         "Basic GraphQL knowledge (or willingness to learn)",
         "Passion for education and accessibility",
      ],
      responsibilities: [
         "Develop interactive learning modules",
         "Integrate with GraphQL APIs",
         "Write accessible, mobile-friendly components",
      ],
      matchReasons: [
         "React is a core skill in your profile",
         "Remote preference matches",
         "EdTech aligns with your stated interests",
      ],
      salary: "$2,400 / month",
   },
];

// In-memory state (simulates server state in mock mode)
const mockMatchesState: Match[] = mockMatches.map((m) => ({ ...m }));

// ─── Filtering & sorting helpers ──────────────────────────────────────────────
function applyFilters(matches: Match[], filters: Partial<MatchFilters>): Match[] {
   let result = [...matches];

   if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
         (m) =>
            m.companyName.toLowerCase().includes(q) ||
            m.role.toLowerCase().includes(q) ||
            m.location.toLowerCase().includes(q) ||
            m.tags.some((t) => t.toLowerCase().includes(q)),
      );
   }

   if (filters.location) {
      result = result.filter((m) =>
         m.location.toLowerCase().includes(filters.location!.toLowerCase()),
      );
   }

   if (filters.industry) {
      result = result.filter((m) =>
         m.companyIndustry.toLowerCase().includes(filters.industry!.toLowerCase()),
      );
   }

   if (filters.type) {
      result = result.filter((m) => m.type === filters.type);
   }

   if (filters.minScore) {
      result = result.filter((m) => m.matchScore >= filters.minScore!);
   }

   if (filters.status === "saved") {
      result = result.filter((m) => m.saved);
   } else if (filters.status === "applied") {
      result = result.filter((m) => m.applied);
   }

   if (filters.sort === "score" || !filters.sort) {
      result.sort((a, b) => b.matchScore - a.matchScore);
   } else if (filters.sort === "recent") {
      result.sort(
         (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
   } else if (filters.sort === "location") {
      result.sort((a, b) => a.location.localeCompare(b.location));
   }

   return result;
}

// ─── Mock API functions ────────────────────────────────────────────────────────
const mockGetMatches = async (filters: Partial<MatchFilters>): Promise<Match[]> => {
   await sleep(500);
   return applyFilters(mockMatchesState, filters);
};

const mockGetMatchById = async (id: string): Promise<Match | null> => {
   await sleep(250);
   return mockMatchesState.find((m) => m.id === id) ?? null;
};

const mockToggleSaveMatch = async (id: string): Promise<Match> => {
   await sleep(300);
   const match = mockMatchesState.find((m) => m.id === id);
   if (!match) throw new Error("Match not found");
   match.saved = !match.saved;
   match.status = match.saved ? "saved" : match.applied ? "applied" : "new";
   return { ...match };
};

const mockApplyToMatch = async (id: string): Promise<Match> => {
   await sleep(600);
   const match = mockMatchesState.find((m) => m.id === id);
   if (!match) throw new Error("Match not found");
   match.applied = true;
   match.status = "applied";
   return { ...match };
};

// ─── Public API ───────────────────────────────────────────────────────────────

/** Get all matches, filtered and sorted */
export async function getMatches(filters: Partial<MatchFilters> = {}): Promise<Match[]> {
   if (isMock()) return mockGetMatches(filters);
   // TODO: GET /api/matches?search=&location=&...
   throw new Error("Real API not implemented");
}

/** Get a single match by ID */
export async function getMatchById(id: string): Promise<Match | null> {
   if (isMock()) return mockGetMatchById(id);
   // TODO: GET /api/matches/:id
   throw new Error("Real API not implemented");
}

/** Toggle save/unsave a match */
export async function toggleSaveMatch(id: string): Promise<Match> {
   if (isMock()) return mockToggleSaveMatch(id);
   // TODO: POST /api/matches/:id/save
   throw new Error("Real API not implemented");
}

/** Apply to a match */
export async function applyToMatch(id: string): Promise<Match> {
   if (isMock()) return mockApplyToMatch(id);
   // TODO: POST /api/matches/:id/apply
   throw new Error("Real API not implemented");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns distinct industries from the mock list */
export function getIndustries(): string[] {
   return Array.from(new Set(mockMatches.map((m) => m.companyIndustry))).sort();
}

/** Returns distinct locations from the mock list */
export function getLocations(): string[] {
   return Array.from(new Set(mockMatches.map((m) => m.location))).sort();
}

/** Returns match score color based on value */
export function getScoreColor(score: number): string {
   if (score >= 85) return "#0C7779"; // success / primary
   if (score >= 70) return "#249E94"; // primary[500]
   if (score >= 60) return "#fa7b41"; // warning
   return "#6B7280"; // muted
}

