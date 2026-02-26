# 📚 Technical Documentation — Boarding Student Portal

> Detailed architecture, data layer, pages, and user flows reference for developers.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Routing Approach](#2-routing-approach)
3. [Layouts](#3-layouts)
4. [Shared UI Philosophy](#4-shared-ui-philosophy)
5. [Theme & Design Tokens](#5-theme--design-tokens)
6. [Data Layer](#6-data-layer)
7. [Types & Models](#7-types--models)
8. [Pages Breakdown](#8-pages-breakdown)
9. [User Flows](#9-user-flows)
10.   [Reusable Components](#10-reusable-components)

---

## 1. Architecture Overview

The project follows a **feature-first architecture** — each domain is a self-contained module under `src/features/`. There is no global state manager (no Redux, no Zustand). State is local to each page component using React's `useState` + `useEffect`, which keeps each feature independently testable and simple to reason about.

```
src/
├── api/              # Shared HTTP infrastructure (client, endpoints, env)
├── app/              # App bootstrap: router, providers, MUI theme
├── contexts/         # React contexts (AuthContext)
├── features/         # One folder per domain feature
├── shared/           # Cross-feature UI: layouts, loading, protected route
├── types/            # Globally shared TypeScript models (models.ts)
└── main.tsx          # Entry point
```

### Key architectural principles

-  **No prop drilling across features** — each feature owns its own state.
-  **Mock-first development** — all features work without a backend via `isMock()` gates in every service.
-  **API-ready by design** — swapping mock → real only requires implementing the `else` branch in each service function.
-  **TypeScript strict mode** — `no any`, all data shapes typed.
-  **MUI v7** — No deprecated Grid `item` prop; layout done via CSS Grid (`display: "grid"`) inside `Box`.

---

## 2. Routing Approach

Routing uses **React Router v7** with `createBrowserRouter`.

```
/                → redirect to /dashboard
/login           → LoginPage (public)
/signup          → SignupPage (public)
/dashboard       → DashboardPage (protected)
/profile         → ProfilePage (protected)
/cv              → CvPage (protected)
/journey         → JourneyPage (protected)
/matching        → MatchingPage (protected)
/appointments    → AppointmentsPage (protected)
/messaging       → MessagingPage (protected)
/resources       → ResourcesPage (protected)
```

**Protection mechanism:**  
All app routes are wrapped in `<ProtectedRoute>` which checks `AuthContext`. If no authenticated user is found, it redirects to `/login`.

**Layout nesting:**  
Protected routes are children of a parent route that renders `<DashboardLayout />`. The layout renders `<Outlet />` inside the main content area, so all page components are injected there automatically.

---

## 3. Layouts

### DashboardLayout (`src/shared/layouts/dashboard-layout.tsx`)

The single layout used for all authenticated pages. It provides:

| Area                    | Description                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **AppBar** (top, fixed) | Search bar (expand-on-focus), notification bell with live unread badge, user avatar + dropdown menu                                        |
| **Sidebar / Drawer**    | Collapsible on desktop (280px ↔ 72px icon-only mode); temporary drawer on mobile. Renders `navConfig` items with active state highlighting |
| **Main content**        | `<Outlet />` — receives padding, background color, and adapts width to sidebar state                                                       |
| **Notifications Panel** | `<NotificationsPanel>` Popover anchored to the bell icon; opens on click, closes on outside click                                          |

**Sidebar collapse:** A `ChevronLeft/Right` toggle button sits on the right edge of the sidebar, visible only on `md+` screens. State is `sidebarOpen: boolean` in the layout.

**Transitions:** Both AppBar width and sidebar width use `225ms cubic-bezier(0.4, 0, 0.6, 1)` transitions for smooth animation.

### AuthLayout (implicit)

Auth pages (`/login`, `/signup`) render without the `DashboardLayout` — they are top-level routes outside the protected children group.

---

## 4. Shared UI Philosophy

All UI follows a consistent card style defined by design tokens (see Section 5):

```tsx
// Standard card box pattern used everywhere
<Box
   sx={{
      border: `1px solid ${tokens.color.border}`,
      borderRadius: `${tokens.radius.card}px`,
      backgroundColor: "#fff",
      p: 2.5,
      "&:hover": {
         borderColor: tokens.color.primary[300],
         boxShadow: tokens.shadow.sm,
      },
   }}
/>
```

**Guiding rules:**

-  No MUI `Card` elevation/shadow — always `boxShadow: "none"` + explicit border.
-  Buttons: `textTransform: "none"`, `fontWeight: 700`, `borderRadius: tokens.radius.control + "px"`, `boxShadow: "none"`.
-  Status chips: `alpha(color, 0.1)` background + matching text color.
-  Empty states: centered icon (48–56px, muted color) + heading + body2 description.
-  All async sections: loading skeleton/spinner → data → error alert (never show a blank page).

---

## 5. Theme & Design Tokens

Defined in `src/app/theme.ts`. Consumed throughout via `import { tokens } from "@/app/theme"`.

### Color tokens

```ts
tokens.color.primary[900]; // #005461  — darkest brand
tokens.color.primary[700]; // #0C7779  — primary action color
tokens.color.primary[500]; // #249E94
tokens.color.primary[300]; // #3BC1A8  — hover tints

tokens.color.background; // #F3F4F6  — app shell background
tokens.color.surface; // #FFFFFF  — cards
tokens.color.border; // #E5E7EB  — all borders/dividers

tokens.color.text.primary; // #1F2937
tokens.color.text.secondary; // #374151
tokens.color.text.muted; // #6B7280

tokens.color.success; // #0C7779
tokens.color.warning; // #fa7b41
tokens.color.error; // #f02929
tokens.color.info; // #2563EB
```

### Radius tokens

```ts
tokens.radius.card; // 12px — cards, drawers, popovers
tokens.radius.control; // 10px — buttons, inputs, chips
```

### Shadow tokens

```ts
tokens.shadow.sm; // subtle card hover shadow
tokens.shadow.md; // menus, drawers, modals
```

### MUI Theme

`createAppMuiTheme()` in `theme.ts` sets:

-  Typography scale matching token sizes
-  Component overrides for `MuiButton`, `MuiTextField`, `MuiChip`
-  Palette mapped to token colors

---

## 6. Data Layer

### API mode switching

```ts
// src/api/env.ts
export const isMock = () => API_MODE === "mock";
// Controlled by VITE_API_MODE env var (default: "mock")
```

### Service pattern

Every feature's `api/index.ts` follows this exact structure:

```ts
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 1. Mutable mock state (simulates a backend store)
let mockItems: Item[] = [
   /* realistic seed data */
];

// 2. Mock implementations (simulate latency with sleep())
const mockGetItems = async (): Promise<Item[]> => {
   await sleep(400);
   return [...mockItems];
};

const mockUpdateItem = async (
   id: string,
   data: Partial<Item>,
): Promise<Item> => {
   await sleep(300);
   mockItems = mockItems.map((i) => (i.id === id ? { ...i, ...data } : i));
   return mockItems.find((i) => i.id === id)!;
};

// 3. Public API — single isMock() gate per function
export async function getItems(): Promise<Item[]> {
   if (isMock()) return mockGetItems();
   // TODO: replace with real API call
   const api = createApiClient({ baseUrl: import.meta.env.VITE_API_URL });
   return api.request<Item[]>(endpoints.items.list);
}
```

### Replacing mocks with real APIs

1. Set `VITE_API_MODE=real` in `.env.local`
2. Set `VITE_API_URL=https://your-api.com` in `.env.local`
3. In each `api/index.ts`, implement the `else` branch using `createApiClient`
4. The mock branch remains as a fallback/testing tool

### HTTP client (`src/api/client.ts`)

A thin wrapper around `fetch`:

-  Accepts `baseUrl` + `defaultHeaders`
-  Supports `json` shorthand for request body
-  Throws typed `ApiError` (with `status` + `body`) on non-2xx responses
-  Returns typed `Promise<T>`

---

## 7. Types & Models

### Global models (`src/types/models.ts`)

Shared types referenced across features:

```ts
User; // { id, fullName, email }
StudentProfile; // personal info + skills + languages + education + experience + preferences
Education; // { id, school, degree, fieldOfStudy, startDate, endDate?, current, description? }
Experience; // { id, company, position, location?, startDate, endDate?, current, description? }
Appointment; // { id, advisorName, startAt, endAt, status }
MessageThread; // { id, title, lastMessageAt, unreadCount }
ChatMessage; // { id, threadId, sender, text, sentAt }
JourneyStep; // { id, title, status: "done"|"in_progress"|"todo", date?, description? }
```

### Feature-local types

Each feature has a `types/index.ts` that may extend global models or define feature-specific shapes. Example pattern:

```ts
// features/matching/types/index.ts
import type { CompanyMatch } from "@/types/models";

export type Match = CompanyMatch & {
  industry: string;
  type: "On-site" | "Remote" | "Hybrid";
  tags: string[];
  saved: boolean;
  applied: boolean;
  status: "open" | "closed" | "applied";
};

export type MatchFilters = { search: string; location: string; ... };
```

---

## 8. Pages Breakdown

---

### 8.1 Dashboard (`/dashboard`)

**Purpose:** Landing page after login. Gives a quick snapshot of everything relevant to the student.

**UI Structure:**

```
Row 1: Page title + greeting ("Welcome back, Alex")
Row 2: 3 KPI stat cards (Total Matches, Upcoming Appointments, Journey Progress %)
Row 3 (CSS Grid 2-col):
  Left (wider): Journey Progress widget + Recommended Matches widget
  Right (narrower): Next Appointment widget + Profile Completion banner (conditional)
```

**Widgets:**

| Widget               | Data source                                                    | Behavior                                                                                                          |
| -------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `StatsCard`          | `getDashboardStats()`                                          | Shows total matches, upcoming appointments count, journey completion %                                            |
| `JourneyProgress`    | `getJourneyProgress()`                                         | Mini timeline of journey stages with status icons                                                                 |
| `RecommendedMatches` | `getRecommendedMatches()` → delegates to `getMatches()`        | Top 3 matches, row layout, score badge, skill chips, bookmark icon                                                |
| `NextAppointment`    | `getUpcomingAppointments()` → delegates to `getAppointments()` | Next scheduled appointment card; "No upcoming" empty state with "Book" CTA                                        |
| `ProfileCompletion`  | `getProfileCompletion()`                                       | Only shown when completion < 100%; warning-colored progress bar + "Complete Profile" CTA navigating to `/profile` |

**State:** Single `loading` + `error` for the full page. All 5 data calls fired in parallel via `Promise.all`. Partial data shown if some calls succeed.

**Mock services:** `dashboard/api/index.ts` — delegates to real feature APIs (`appointments/api`, `matching/api`, `journey/api`, `profile/api`) rather than maintaining separate mock data.

---

### 8.2 Profile (`/profile`)

**Purpose:** Student's personal information hub. Editable in-place.

**UI Structure:**

```
ProfileHeaderCard (full width)
  ← Avatar | Name + school | Email + country meta | Completion bar + chip | Edit/Save/Cancel + Download CV buttons

CSS Grid 2-col (300px / 1fr):
  Left column:
    PersonalInfoSection   ← name, email, phone, school, country (read/edit fields)
    SkillsSection         ← chip list + add form (inline TextField + "Add" button)
    LanguagesSection      ← chip list + add form
    PreferencesSection    ← preferred location + internship type dropdown

  Right column:
    ExperienceSection     ← timeline with add/edit/delete (context menu ⋮)
    EducationSection      ← timeline with add/edit/delete (context menu ⋮)
```

**State:** Global `isEditMode` toggled from the header card. All mutations update `editedProfile` state locally until "Save Changes" is clicked, which calls `updateProfile()`. Snackbar confirms each add/remove action.

**Mock services:** `profile/api/index.ts` → `getProfile()`, `updateProfile()`, `calculateProfileCompletion()`.

---

### 8.3 CV (`/cv`)

**Purpose:** Single-CV management — upload, preview metadata, download, delete.

**UI Structure:**

```
Page header
Alert (error, if any)
State-driven content:
  loading   → <Loading variant="section" />
  no CV     → <CvEmptyState> with upload CTA
  has CV    → <CvFileCard> showing name, size, upload date + action buttons
              <CvUploadZone> below (replace existing CV)
Upload progress → <LinearProgress> during upload
```

**State:** `cv: CvFile | null`, `uploading`, `uploadProgress` (0–100), `downloading`, `deleting`. Each action has its own boolean flag to avoid conflicting UI states.

**Mock services:** `cv/api/index.ts` → `getCv()`, `uploadCv(file, onProgress)`, `downloadCv()`, `deleteCv()`. Upload simulates progress callbacks with `setInterval`.

---

### 8.4 Matching (`/matching`)

**Purpose:** Browse and act on company internship matches ranked by score.

**UI Structure:**

```
Page header + "X matches found" count
<MatchFiltersBar>:
  Search input | Location dropdown | Industry dropdown | Type dropdown | Sort dropdown
  "More Filters" toggle (Tune icon) → collapsible row: Score slider | Status filter
<Grid layout (responsive)>:
  <MatchCard> per result
<MatchDetailsDrawer> (right drawer, opens on card click)
```

**MatchCard shows:** Company name + logo avatar, score badge (color: green ≥80 / orange ≥60 / default <60), location + type chips, industry tag, first 3 skill tags, Save button, Apply button.

**Filters:** Debounced search (300ms ref-based), instant filter for all dropdowns. `DEFAULT_FILTERS` constant used to reset. `allCount` tracked separately from filtered count for the counter label.

**More Filters:** Collapsible `Box` controlled by `showMoreFilters: boolean`. Contains min-score slider and status chip group (All / Open / Applied / Saved / Closed).

**Actions:**

-  `toggleSaveMatch(id)` → optimistic UI update, mock flips `saved` flag
-  `applyToMatch(id)` → sets `applied: true`, `status: "applied"` in mock state

**Mock services:** `matching/api/index.ts` → `getMatches(filters)`, `getIndustries()`, `getLocations()`, `getScoreColor(score)`, `toggleSaveMatch(id)`, `applyToMatch(id)`.

---

### 8.5 Appointments (`/appointments`)

**Purpose:** Manage student-advisor appointments across all lifecycle states.

**UI Structure:**

```
Page header + "Book Appointment" button (primary, top right)
<Tabs>: Upcoming | Past | Cancelled
<AppointmentCard> list per tab
<AppointmentDetailsDrawer> (right drawer on card click)
<BookAppointmentDialog> (modal: select advisor, date, time, type, notes)
<RescheduleDialog> (modal: new date + time)
Snackbar toast for all actions
```

**AppointmentCard shows:** Advisor avatar + name + role, date/time, duration, type chip (Online/On-site), status badge, action buttons (Reschedule / Cancel for upcoming; View for past).

**Tabs:** Filter logic done client-side using `isUpcoming(apt)` and `isPast(apt)` helper functions from the API module.

**State:** Single `appointments[]` array. Mutations call API then refresh with `loadAppointments()`. Separate loading flags: `cancellingId`, `bookingSubmitting`, `rescheduleSubmitting`.

**Mock services:** `appointments/api/index.ts` → `getAppointments()`, `bookAppointment(payload)`, `rescheduleAppointment(id, payload)`, `cancelAppointment(id)`, `getAvailableAdvisors()`, `getAvailableSlots(advisorId, date)`, `isUpcoming(apt)`, `isPast(apt)`.

---

### 8.6 Messaging (`/messaging`)

**Purpose:** Chat interface between student and multiple advisors.

**UI Structure:**

```
Full-height split panel (CSS Grid):
  Left panel (conversation list):
    Search input
    Filter tabs: All | Unread | Read
    <ConversationList> — avatar, name, role, last message preview, timestamp, unread badge
    "New Chat" button (opens <NewChatDialog>)

  Right panel (chat window):
    Chat header: advisor name + role + online indicator
    Message list (scrollable, reverse-chronological display)
    Message input + Send button
```

**Conversation list behavior:** Clicking a conversation marks it as read (unread badge disappears), loads its messages (with inline spinner), and opens the chat window. Filter tabs filter the conversation list in real time.

**New chat:** `<NewChatDialog>` lets students pick an advisor from a list and type a first message. Creates a new conversation entry in the mock state.

**State:** `conversations[]`, `messageMap: Record<conversationId, Message[]>`, `selectedId`. Messages per conversation are lazy-loaded on first selection and cached in `messageMap`.

**Mock services:** `messaging/api/index.ts` → `getConversations()`, `getMessages(conversationId)`, `sendMessage(payload)`, `markConversationRead(id)`, `startConversation(advisorId, message)`, `getAvailableAdvisors()`.

---

### 8.7 Journey Tracking (`/journey`)

**Purpose:** Visual representation of the student's milestones from application to placement.

**UI Structure:**

```
Page header + "Scroll to current step" button
<JourneySummaryCard> (full width):
  Overall progress bar, step counts (done/in_progress/todo), phase label
<Divider>
Vertical timeline of <JourneyStepCard> components:
  Status icon (✓ done / spinner in_progress / circle todo)
  Step title + description
  Date chip
  "View details" expand action (optional)
```

**Step statuses:**

-  `done` — green check icon, full opacity
-  `in_progress` — primary color, spinning indicator
-  `todo` — muted circle, reduced opacity

**Dashboard sync:** The `JourneyProgress` widget on the Dashboard calls the same `getJourneyData()` service and displays a condensed version (mini step list + overall % bar). The data is identical — no separate mock.

**State:** `journeyData: JourneyData | null`. Single fetch on mount via `loadJourney()`. Error state shows retry button.

**Mock services:** `journey/api/index.ts` → `getJourneyData()` returns `{ summary: JourneySummary, steps: JourneyStep[] }`.

---

### 8.8 Resources (`/resources`)

**Purpose:** Curated library of learning resources: articles, PDFs, videos, guides.

**UI Structure:**

```
Page header + resource count
<ResourceFiltersBar>:
  Search (debounced 300ms) | Category chips | Type dropdown | Sort dropdown
<Grid layout (responsive 1–3 columns)>:
  <ResourceCard> per result
<ResourceDetailsDrawer> (right drawer on card click)
Empty state: folder icon + "No resources found"
```

**ResourceCard shows:** Type icon + color badge, title, description (2-line clamp), category chip, duration/pages meta, bookmark icon (toggle save), "Open" button.

**Filters:** Same debounced search pattern as Matching. Category is a chip group (All + category names). Type is a dropdown. Sort: Recent / Most Viewed / A–Z.

**State:** `resources[]`, `allCount` (unfiltered count for display), `selectedId` (drawer), `bookmarkingId` (per-item loading state for bookmark toggle).

**Mock services:** `resources/api/index.ts` → `getResources(filters)`, `getResourceById(id)`, `toggleBookmark(id)`, `incrementResourceView(id)`, `getCategories()`.

---

### 8.9 Notifications (Panel only)

**Purpose:** Real-time notification feed accessible from the AppBar bell icon.

**UI Structure (Popover panel, 400px):**

```
Header: "Notifications" + unread count pill + "Mark all as read" button
Tabs: All | Unread | Read
Scrollable list of <NotificationItem>:
  Type icon (Info/Success/Warning) | Title (bold if unread) | 2-line message
  Type chip + relative timestamp | Unread blue dot
Footer: "View all notifications" text button (navigates to full page if enabled)
```

**NotificationItem behavior:**

-  Click → marks as read + navigates to `notification.link` if present
-  Blue left border + subtle background tint on unread items
-  Unread dot disappears on read

**Badge:** Live `unreadCount` state in `DashboardLayout`. Updated via `onUnreadCountChange` callback passed to the panel. Initial optimistic value matches mock data seed count.

**State:** Panel re-fetches `getNotifications()` every time it opens. No auto-polling. Filter state is local to the panel.

**Mock services:** `notifications/api/index.ts` → `getNotifications(params)`, `getUnreadCount()`, `markAsRead(id)`, `markAllAsRead()`, `clearNotification(id)`, `clearAll()`.

---

## 9. User Flows

### 9.1 Login → Dashboard

```
/login
  → user enters any email + password → submit
  → mockLogin() fires (700ms delay)
  → success: token + user stored in AuthContext (localStorage)
  → redirect to /dashboard
  → DashboardPage mounts → 5 parallel API calls (stats, appointments, journey, profile, matches)
  → all widgets populate simultaneously
```

### 9.2 Matching → Save / Apply

```
/matching loads → getMatches(DEFAULT_FILTERS) called
  → MatchCards rendered with score badges

User adjusts filters:
  → search: debounced 300ms → getMatches(updatedFilters)
  → dropdowns: immediate → getMatches(updatedFilters)
  → "More Filters" toggle → collapsible panel opens (no API call, just local state)

User clicks a MatchCard:
  → setSelectedMatchId(id) → MatchDetailsDrawer opens (slides in from right)
  → Drawer shows full company details, skills, description, action buttons

User clicks "Save":
  → setSavingId(id) → toggleSaveMatch(id) called
  → optimistic update: card bookmark icon flips instantly
  → setSavingId(null)

User clicks "Apply":
  → setApplyingId(id) → applyToMatch(id) called
  → card status chip changes to "Applied"
  → "Apply" button becomes disabled
```

### 9.3 Appointments → Book / Reschedule / Cancel

```
/appointments loads → getAppointments() → list split by tab

"Book Appointment" clicked:
  → BookAppointmentDialog opens
  → getAvailableAdvisors() populates advisor dropdown
  → user selects advisor → getAvailableSlots(advisorId, date) populates time slots
  → user fills form → submit → bookAppointment(payload)
  → dialog closes → loadAppointments() refreshes list → toast "Booked!"

"Reschedule" on a card:
  → setRescheduleId(id) → RescheduleDialog opens with current appointment info
  → user picks new date + time → submit → rescheduleAppointment(id, payload)
  → dialog closes → list refreshes → toast "Rescheduled!"

"Cancel" on a card:
  → confirm → setCancellingId(id) → cancelAppointment(id)
  → appointment moves to "Cancelled" tab → toast "Cancelled."
```

### 9.4 Messaging → Conversation → Send

```
/messaging loads → getConversations() → ConversationList renders

User clicks a conversation:
  → markConversationRead(id) called → unread badge clears
  → if messages not cached: getMessages(id) → loading spinner in ChatWindow
  → messages cached in messageMap → ChatWindow renders

User types + sends:
  → setSending(true) → sendMessage({ conversationId, text })
  → new message appended to messageMap[id] optimistically
  → conversation list item updated (last message + timestamp)
  → setSending(false)

Filter tabs (All/Unread/Read):
  → client-side filter on conversations array (no extra API call)

"New Chat":
  → NewChatDialog opens → user selects advisor + types first message
  → startConversation(advisorId, message) → new conversation added to list
  → dialog closes → new conversation auto-selected
```

### 9.5 Journey Tracking ↔ Dashboard Sync

```
Both /journey and /dashboard call getJourneyData() from journey/api/index.ts.
They share the same mock state (module-level variable), so:
  - Completing a journey step on /journey would reflect on /dashboard on next load.
  - Currently read-only — no "mark step complete" action exposed in UI.
  - Dashboard shows a condensed JourneyProgress widget (summary + mini step list).
  - Journey page shows the full timeline with JourneySummaryCard + all JourneyStepCards.
```

### 9.6 Resources → Open / Save

```
/resources loads → getResources(DEFAULT_FILTERS) → grid of ResourceCards

User types in search:
  → 300ms debounce → getResources({ ...filters, search }) → grid updates

User clicks bookmark icon on a card:
  → setBookmarkingId(id) → toggleBookmark(id) → icon flips
  → incrementResourceView not triggered (only on open/drawer view)

User clicks a ResourceCard (not bookmark):
  → setSelectedId(id) → ResourceDetailsDrawer opens
  → getResourceById(id) → full detail loaded in drawer
  → incrementResourceView(id) called → view count increases in mock state
  → drawer shows: title, description, full metadata, "Open Resource" button
```

---

## 10. Reusable Components

### `Loading` (`src/shared/components/loading/loading.tsx`)

Universal loading component with three variants:

| Variant     | Usage                         | Visual                                                  |
| ----------- | ----------------------------- | ------------------------------------------------------- |
| `"page"`    | Full-page initial load        | Centered spinner + optional label, full viewport height |
| `"section"` | Within a card or page section | Centered spinner, `minHeight` prop, inline              |
| `"inline"`  | Button/action loading         | Small spinner, fits inline with text                    |

```tsx
// Usage examples
<Loading variant="page" />
<Loading variant="section" minHeight={300} />
<Loading variant="inline" />
```

### `SplashScreen` / `LoadingScreen`

Used during app bootstrap (auth hydration from localStorage) before the router renders.

### `ProtectedRoute` (`src/shared/components/protected-route.tsx`)

Wraps all authenticated routes. Reads `AuthContext`. Redirects to `/login` if no user. Renders `<SplashScreen>` while auth state is being hydrated.

### Feature-level reusable components

| Component            | Feature       | Reuse                                                                 |
| -------------------- | ------------- | --------------------------------------------------------------------- |
| `MatchCard`          | matching      | Used in Matching page + referenced in Dashboard `RecommendedMatches`  |
| `AppointmentCard`    | appointments  | Used in Appointments page + referenced in Dashboard `NextAppointment` |
| `NotificationItem`   | notifications | Used in both the panel and (optionally) the full-page list            |
| `MatchFiltersBar`    | matching      | Self-contained filter bar with debounce; all filter state internal    |
| `ResourceFiltersBar` | resources     | Same pattern as MatchFiltersBar                                       |
| `ConversationList`   | messaging     | Accepts filter + selection props; fully controlled                    |
| `ChatWindow`         | messaging     | Accepts messages[], sending state, onSend handler                     |
| `JourneySummaryCard` | journey       | Used in Journey page header; shares data shape with dashboard widget  |
| `JourneyStepCard`    | journey       | Individual step row in the timeline                                   |

### Design patterns across all cards

**Drawers (Details panels):**

-  Right-anchored MUI `Drawer`, width 400–480px
-  Triggered by `selectedId` state
-  Fetch detail on `selectedId` change (`getXById(id)`)
-  Close sets `selectedId(null)`

**Dialogs (Forms):**

-  MUI `Dialog` with `maxWidth="sm"` or `"md"`
-  Controlled by boolean `open` prop
-  Submit disabled while `submitting` is true
-  Shows inline `CircularProgress` on submit button

**Snackbar toasts:**

-  Bottom-center anchor, `autoHideDuration={3000}`
-  Success (green) for confirmations, Error (red) for failures
-  Separate `toast` state: `{ open: boolean, message: string }`
