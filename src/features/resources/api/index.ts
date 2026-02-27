import { createApiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { isMock, getApiBaseUrl } from "@/api/env";
import { mockDelay } from "@/api/mock-helpers";
import type { Resource, ResourceFilters } from "../types";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockResourcesState: Resource[] = [
   {
      id: "res-1",
      title: "Student Housing Guide: Finding Your Perfect Home",
      category: "Housing",
      type: "Article",
      description:
         "Complete guide to finding student accommodation, from dorms to private rentals.",
      content: `# Student Housing Guide\n\n## Finding Your Perfect Home\n\nLooking for student housing can be overwhelming. This guide will help you navigate the process step by step.\n\n### Types of Accommodation\n\n**University Dorms**\nMost universities offer on-campus housing for first-year students. Benefits include proximity to campus, built-in social life, and utilities included in rent.\n\n**Private Apartments**\nRenting privately gives you more independence. Make sure to check lease terms, security deposits, and utility arrangements.\n\n**Shared Housing**\nLiving with roommates can reduce costs significantly. Use trusted platforms to find compatible housemates.\n\n### Budget Planning\n\nSet aside 30-40% of your monthly budget for rent. Remember to factor in utilities, internet, and groceries.\n\n### Important Documents\n\n- Valid ID or passport\n- Proof of enrollment\n- Bank statements (last 3 months)\n- Previous landlord references\n\n### Tips for Success\n\n1. Start your search early (2-3 months before moving)\n2. Visit properties in person when possible\n3. Read the entire lease agreement\n4. Take photos before moving in\n5. Keep all communication in writing`,
      minutes: 8,
      bookmarked: true,
      createdAt: "2026-02-20T10:00:00Z",
      views: 342,
   },
   {
      id: "res-2",
      title: "Top 10 Local Integration Tips for International Students",
      category: "Integration",
      type: "Article",
      description:
         "Practical advice on adapting to local culture, making friends, and feeling at home.",
      content: `# Top 10 Local Integration Tips\n\n## For International Students\n\nMoving to a new country is exciting but can also be challenging. Here are our top tips for settling in.\n\n### 1. Join Student Organizations\n\nUniversities have dozens of clubs covering every interest. It's the fastest way to meet like-minded people.\n\n### 2. Attend Orientation Events\n\nDon't skip orientation week! These events are designed to help you connect with other new students.\n\n### 3. Learn Basic Local Phrases\n\nEven if classes are in English, learning a few phrases in the local language shows respect and opens doors.\n\n### 4. Explore Your Neighborhood\n\nTake walks, find your nearest grocery store, pharmacy, and public transport stops.\n\n### 5. Try Local Cuisine\n\nFood is culture. Visit local markets and try traditional dishes.\n\n### 6. Use Public Transport\n\nGet a student transit pass and learn the bus/metro routes. It's cheaper and more sustainable.\n\n### 7. Volunteer\n\nVolunteering is a great way to give back and meet locals outside the university bubble.\n\n### 8. Be Open-Minded\n\nCultural differences can be surprising. Approach them with curiosity rather than judgment.\n\n### 9. Stay Connected with Home\n\nMaintain relationships back home while building new ones here.\n\n### 10. Ask for Help\n\nUniversities have support services for international students. Use them!`,
      minutes: 6,
      bookmarked: false,
      createdAt: "2026-02-18T14:30:00Z",
      views: 289,
   },
   {
      id: "res-3",
      title: "Language Exchange Programs Near You",
      category: "Language",
      type: "Link",
      description:
         "Find local language exchange meetups and practice with native speakers.",
      url: "",
      minutes: 2,
      bookmarked: true,
      createdAt: "2026-02-15T09:00:00Z",
      views: 156,
   },
   {
      id: "res-4",
      title: "Administrative Checklist for New Students",
      category: "Admin",
      type: "Checklist",
      description:
         "Step-by-step checklist covering registration, insurance, residence permits, and more.",
      content: `# Administrative Checklist\n\n## Week 1: Arrival\n\n- [ ] Collect accommodation keys\n- [ ] Register at university administration office\n- [ ] Get student ID card\n- [ ] Set up bank account (if needed)\n- [ ] Purchase local SIM card\n\n## Week 2: Registration\n\n- [ ] Register with local city hall (mandatory in many countries)\n- [ ] Apply for residence permit (non-EU students)\n- [ ] Enroll in health insurance\n- [ ] Register for courses\n\n## Week 3: Settling In\n\n- [ ] Set up utilities (if not included in rent)\n- [ ] Get public transport student pass\n- [ ] Register at library\n- [ ] Join student email lists\n\n## Ongoing\n\n- [ ] Attend all mandatory orientation sessions\n- [ ] Keep copies of all important documents\n- [ ] Update address with university if you move\n- [ ] Renew residence permit 3 months before expiry`,
      minutes: 5,
      bookmarked: false,
      createdAt: "2026-02-12T11:00:00Z",
      views: 478,
   },
   {
      id: "res-5",
      title: "Understanding Your Health Insurance Options",
      category: "Admin",
      type: "PDF",
      description:
         "Comprehensive PDF guide explaining student health insurance plans and coverage.",
      url: "",
      minutes: 10,
      bookmarked: false,
      createdAt: "2026-02-10T16:00:00Z",
      views: 234,
   },
   {
      id: "res-6",
      title: "Community Events Calendar: March 2026",
      category: "Community",
      type: "Link",
      description:
         "Upcoming social events, workshops, and cultural activities for students.",
      url: "",
      minutes: 3,
      bookmarked: true,
      createdAt: "2026-02-08T08:00:00Z",
      views: 412,
   },
   {
      id: "res-7",
      title: "Budgeting 101: Managing Money as a Student",
      category: "Integration",
      type: "Video",
      description:
         "15-minute video tutorial on creating a student budget, tracking expenses, and saving tips.",
      url: "",
      minutes: 15,
      bookmarked: false,
      createdAt: "2026-02-05T13:00:00Z",
      views: 567,
   },
   {
      id: "res-8",
      title: "Learn the Local Language: Free Resources",
      category: "Language",
      type: "Article",
      description:
         "Curated list of free apps, websites, and podcasts for language learning.",
      content: `# Learn the Local Language\n\n## Free Resources to Get Started\n\n### Apps\n\n**Duolingo**\nGreat for beginners. Gamified lessons covering vocabulary and basic grammar.\n\n**Tandem**\nConnect with native speakers for language exchange via text, voice, or video.\n\n**Anki**\nFlashcard app perfect for memorizing vocabulary. Use pre-made decks or create your own.\n\n### Websites\n\n**BBC Languages**\nFree courses with audio, video, and interactive exercises.\n\n**Lang-8**\nWrite journal entries and get corrections from native speakers.\n\n### Podcasts\n\n- Coffee Break Languages (beginner-friendly)\n- News in Slow [Language]\n- Language Transfer (unique teaching method)\n\n### YouTube Channels\n\n- Easy Languages (street interviews with subtitles)\n- [Language] with Paul\n- Learn [Language] with [Name]\n\n### Local Opportunities\n\n- University language courses (often free for students)\n- Language exchange meetups\n- Conversation tables at cafes\n- Library conversation groups\n\n### Tips for Success\n\n1. Practice daily, even if just 10 minutes\n2. Don't be afraid to make mistakes\n3. Immerse yourself: change phone/app language\n4. Watch TV shows with subtitles\n5. Label items in your home with vocabulary stickers`,
      minutes: 7,
      bookmarked: false,
      createdAt: "2026-02-03T10:30:00Z",
      views: 321,
   },
   {
      id: "res-9",
      title: "Roommate Agreement Template",
      category: "Housing",
      type: "PDF",
      description:
         "Downloadable template for creating clear expectations with roommates.",
      url: "",
      minutes: 4,
      bookmarked: true,
      createdAt: "2026-02-01T15:00:00Z",
      views: 198,
   },
   {
      id: "res-10",
      title: "Cultural Etiquette Guide",
      category: "Integration",
      type: "Article",
      description:
         "Dos and don'ts for social interactions, dining, and professional settings.",
      content: `# Cultural Etiquette Guide\n\n## Social Interactions\n\n### Greetings\n\nIn many European countries, a handshake is standard. Some cultures prefer cheek kisses (typically 2-3 depending on region).\n\n### Punctuality\n\nBeing on time is highly valued in professional settings. For social events, "fashionably late" (10-15 min) may be acceptable.\n\n### Personal Space\n\nRespect varies by culture. Southern Europeans tend to stand closer than Northern Europeans.\n\n## Dining\n\n### Table Manners\n\n- Keep hands visible (wrists on table edge)\n- Wait for host to start eating\n- Finish everything on your plate (shows appreciation)\n- Never ask to split bills at formal dinners\n\n### Tipping\n\nTipping customs vary:\n- Some countries include service in bill\n- Others expect 10-15% gratuity\n- Always check if service is included\n\n## Professional Settings\n\n### Meetings\n\n- Arrive 5 minutes early\n- Dress formally until you understand the culture\n- Turn phone to silent\n- Take notes\n\n### Email\n\n- Use formal greetings initially\n- Mirror the formality level of responses\n- Respond within 24 hours\n\n## General Tips\n\n- Observe before acting\n- When unsure, err on the side of formality\n- Ask questions—people appreciate genuine curiosity\n- Apologize if you make a cultural mistake`,
      minutes: 6,
      bookmarked: false,
      createdAt: "2026-01-28T12:00:00Z",
      views: 445,
   },
   {
      id: "res-11",
      title: "Student Visa Extension Process Explained",
      category: "Admin",
      type: "Article",
      description:
         "Step-by-step guide for extending your student visa before expiration.",
      content: `# Student Visa Extension Process\n\n## When to Apply\n\nStart the process 3-4 months before your current visa expires. Do NOT wait until the last minute.\n\n## Required Documents\n\n### Essential\n\n1. Valid passport (must be valid 6+ months beyond extension period)\n2. Current student visa\n3. Proof of enrollment for next academic period\n4. Financial proof (bank statements, scholarship letter)\n5. Health insurance certificate\n6. Completed application form\n7. Recent passport photos (check specific requirements)\n\n### Additional (may be required)\n\n- Accommodation proof\n- Academic transcripts\n- Letter from university\n- No-objection certificate from sponsor (if applicable)\n\n## Application Steps\n\n### 1. Gather Documents\n\nMake copies of everything. Keep originals and copies in separate locations.\n\n### 2. Book Appointment\n\nMost countries require online appointment booking. Slots fill quickly—book early.\n\n### 3. Submit Application\n\nArrive on time with all documents organized. Some offices accept online submissions.\n\n### 4. Pay Fees\n\nFees vary by country and visa type. Keep receipt—you'll need it to collect visa.\n\n### 5. Biometrics\n\nYou may need to provide fingerprints and photo at appointment.\n\n### 6. Wait for Decision\n\nProcessing time: 4-12 weeks typically. You'll receive email or SMS update.\n\n### 7. Collect Visa\n\nBring appointment confirmation and payment receipt.\n\n## Important Notes\n\n- Your current visa usually remains valid during processing\n- Check if you can travel abroad while application is pending\n- Keep proof of submission in case of delays\n- Contact university international office if you need help\n\n## If Denied\n\nYou usually have the right to appeal. Seek advice from university legal services immediately.`,
      minutes: 9,
      bookmarked: true,
      createdAt: "2026-01-25T09:30:00Z",
      views: 512,
   },
   {
      id: "res-12",
      title: "Join the International Student Network",
      category: "Community",
      type: "Link",
      description:
         "Connect with 500+ international students through our online community.",
      url: "",
      minutes: 2,
      bookmarked: false,
      createdAt: "2026-01-22T14:00:00Z",
      views: 267,
   },
   {
      id: "res-13",
      title: "Public Transport Guide for Students",
      category: "Integration",
      type: "PDF",
      description:
         "Complete metro and bus map with student discount information.",
      url: "",
      minutes: 5,
      bookmarked: false,
      createdAt: "2026-01-20T11:00:00Z",
      views: 389,
   },
   {
      id: "res-14",
      title: "Language Certification Exam Prep",
      category: "Language",
      type: "Video",
      description:
         "20-minute video on preparing for official language proficiency tests.",
      url: "",
      minutes: 20,
      bookmarked: true,
      createdAt: "2026-01-18T16:30:00Z",
      views: 423,
   },
   {
      id: "res-15",
      title: "Emergency Contacts and Services",
      category: "Admin",
      type: "Checklist",
      description:
         "Essential phone numbers and addresses for emergencies, health, and support.",
      content: `# Emergency Contacts\n\n## Save These Numbers\n\n### Emergency Services\n\n- **Police**: 112\n- **Ambulance**: 112\n- **Fire**: 112\n- **Non-emergency Police**: [Local number]\n\n### Health Services\n\n- **University Health Center**: [Phone]\n  Hours: Mon-Fri 9:00-17:00\n- **24h Emergency Clinic**: [Phone]\n  Address: [Address]\n- **Pharmacy on Duty** (nights/weekends): [Phone]\n- **Mental Health Hotline**: [Phone] (24/7, free, confidential)\n\n### University Support\n\n- **International Student Office**: [Phone] / [Email]\n- **Student Services**: [Phone]\n- **Campus Security**: [Phone] (24/7)\n- **Housing Office**: [Phone]\n\n### Consular Services\n\n- **Your Embassy/Consulate**: [Phone]\n  Address: [Address]\n  Emergency After-Hours: [Phone]\n\n### Utilities & Services\n\n- **Lost/Stolen Cards**: [Bank phone]\n- **Lost/Stolen Phone**: [Carrier phone]\n- **Electricity Emergency**: [Phone]\n- **Water Emergency**: [Phone]\n\n### Transportation\n\n- **Taxi Service**: [Phone]\n- **Airport Shuttle**: [Phone]\n- **Train Info**: [Phone]\n\n## What to Do in an Emergency\n\n### Medical Emergency\n\n1. Call 112\n2. Give address and describe situation\n3. Follow dispatcher instructions\n4. Bring ID and insurance card to hospital\n\n### Lost/Stolen Passport\n\n1. File police report immediately\n2. Contact your embassy\n3. Notify university international office\n4. Apply for emergency travel document if needed\n\n### Locked Out\n\n1. Contact landlord or dorm supervisor\n2. Campus security (if on-campus housing)\n3. Locksmith (keep insurance info handy)\n\n## Prepare Now\n\n- [ ] Save these numbers in your phone\n- [ ] Keep physical copy in wallet\n- [ ] Share with family back home\n- [ ] Know your exact address in local language\n- [ ] Keep emergency fund (cash) at home`,
      minutes: 4,
      bookmarked: false,
      createdAt: "2026-01-15T10:00:00Z",
      views: 601,
   },
   {
      id: "res-16",
      title: "Finding Part-Time Work as a Student",
      category: "Community",
      type: "Article",
      description:
         "Legal requirements, job search tips, and balancing work with studies.",
      content: `# Finding Part-Time Work\n\n## Check Your Visa First\n\nMost student visas allow 15-20 hours/week during term, full-time during breaks. **Verify your specific visa restrictions before applying.**\n\n## Where to Look\n\n### On-Campus Jobs\n\n- Library assistant\n- Research assistant\n- Teaching assistant\n- Campus tour guide\n- Student union positions\n- Cafeteria/bookstore\n\n### Off-Campus\n\n- Retail (clothing stores, supermarkets)\n- Hospitality (restaurants, hotels, cafes)\n- Tutoring (high-demand for English, Math, Science)\n- Babysitting\n- Delivery services\n- Freelance (writing, design, programming)\n\n## Job Search Platforms\n\n- University job board (check weekly)\n- LinkedIn\n- Local job sites\n- Student job agencies\n- Facebook student groups\n\n## Application Tips\n\n### CV/Resume\n\n- Keep it to 1-2 pages\n- Highlight transferable skills\n- Include language skills\n- Mention your studies (shows intelligence and motivation)\n\n### Cover Letter\n\n- Customize for each job\n- Explain your visa situation clearly\n- Emphasize flexibility and reliability\n- Mention your available hours upfront\n\n### Interview\n\n- Dress appropriately\n- Be honest about academic commitments\n- Highlight soft skills (communication, teamwork, problem-solving)\n- Ask about shift flexibility\n\n## Legal Requirements\n\n- Work permit (check if you need one)\n- Tax number (get from tax office)\n- Social security registration\n- Bank account\n\n## Balancing Work and Studies\n\n### Time Management\n\n- Prioritize exams and deadlines\n- Don't exceed visa hours\n- Block out study time\n- Communicate with employer about exam periods\n\n### Red Flags to Avoid\n\n- Jobs offering cash-only payment (usually illegal)\n- Employers unwilling to give contract\n- Requests for upfront payment\n- Unrealistic promises\n\n## Tax Information\n\nYou'll likely need to file a tax return at year-end. Keep:\n- Pay slips\n- Work contract\n- Bank statements\n\nMany students get tax refunds!`,
      minutes: 8,
      bookmarked: false,
      createdAt: "2026-01-12T13:00:00Z",
      views: 534,
   },
];

// ── API Functions ────────────────────────────────────────────────────────────

export async function getResources(
   filters?: ResourceFilters,
): Promise<Resource[]> {
   if (isMock()) {
      await mockDelay(400);
      let results = [...mockResourcesState];

      // Filter by search
      if (filters?.search) {
         const query = filters.search.toLowerCase();
         results = results.filter(
            (r) =>
               r.title.toLowerCase().includes(query) ||
               r.description.toLowerCase().includes(query),
         );
      }

      // Filter by category
      if (filters?.category && filters.category !== "All") {
         results = results.filter((r) => r.category === filters.category);
      }

      // Filter by type
      if (filters?.type && filters.type !== "All") {
         results = results.filter((r) => r.type === filters.type);
      }

      // Sort
      const sortBy = filters?.sort ?? "recent";
      if (sortBy === "recent") {
         results.sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt),
         );
      } else if (sortBy === "popular") {
         results.sort((a, b) => b.views - a.views);
      } else if (sortBy === "az") {
         results.sort((a, b) => a.title.localeCompare(b.title));
      }

      return results;
   }
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   const params = new URLSearchParams();
   if (filters?.search) params.set("search", filters.search);
   if (filters?.category) params.set("category", filters.category);
   if (filters?.type) params.set("type", filters.type);
   if (filters?.sort) params.set("sort", filters.sort);
   const query = params.toString();
   return api.request<Resource[]>(`${endpoints.resources.list}${query ? `?${query}` : ""}`, { method: "GET" });
}

export async function getResourceById(id: string): Promise<Resource | null> {
   if (isMock()) {
      await mockDelay(250);
      return mockResourcesState.find((r) => r.id === id) ?? null;
   }
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   return api.request<Resource>(endpoints.resources.byId(id), { method: "GET" });
}

export async function toggleBookmark(id: string): Promise<Resource> {
   if (isMock()) {
      await mockDelay(150);
      const idx = mockResourcesState.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Resource not found");
      mockResourcesState[idx] = {
         ...mockResourcesState[idx],
         bookmarked: !mockResourcesState[idx].bookmarked,
      };
      return { ...mockResourcesState[idx] };
   }
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   return api.request<Resource>(endpoints.resources.bookmark(id), { method: "POST" });
}

export async function incrementResourceView(id: string): Promise<void> {
   if (isMock()) {
      await mockDelay(50);
      const idx = mockResourcesState.findIndex((r) => r.id === id);
      if (idx !== -1) {
         mockResourcesState[idx] = {
            ...mockResourcesState[idx],
            views: mockResourcesState[idx].views + 1,
         };
      }
      return;
   }
   const api = createApiClient({ baseUrl: getApiBaseUrl() });
   await api.request<void>(endpoints.resources.view(id), { method: "POST" });
}