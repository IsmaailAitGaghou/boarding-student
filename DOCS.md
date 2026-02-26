# 📚 Project Documentation — Boarding Student Portal

> A quick reference for developers working on this codebase.

---

## 1. Project Overview

The **Boarding Student Portal** is a frontend-only React application for students managing their internship journey. It covers profile management, CV upload, company matching, appointments with advisors, messaging, journey tracking, resource browsing, and in-app notifications.

All data is **mocked** — no backend is required to run the app.

---

## 2. Tech Stack

| Tool              | Version | Role                              |
| ----------------- | ------- | --------------------------------- |
| React             | 19      | UI framework                      |
| Vite              | 7       | Build tool & dev server           |
| TypeScript        | 5.9     | Language (strict mode)            |
| MUI (Material UI) | 7       | Component library + icons         |
| React Router      | 7       | Client-side routing               |
| react-hook-form   | 7       | Form handling                     |
| date-fns          | 4       | Date formatting                   |
| ApexCharts        | 5       | Charts (dashboard stats)          |
| Axios             | 1       | HTTP client (for future real API) |

---

## 3. Project Structure

```
src/
├── api/                # HTTP client, base endpoints, env config
├── app/                # Router, theme, providers bootstrap
├── contexts/           # AuthContext (login state)
├── features/           # One folder per feature/domain
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── cv/
│   ├── journey/
│   ├── matching/
│   ├── appointments/
│   ├── messaging/
│   ├── resources/
│   └── notifications/
├── shared/
│   ├── components/     # Loading, ProtectedRoute
│   └── layouts/        # DashboardLayout, nav-config
└── types/              # Global shared TypeScript models
```

Every feature follows the same internal pattern:

```
features/{name}/
├── api/        # Service functions (mock + real stubs)
├── components/ # UI components for this feature
├── pages/      # Page-level component
├── types/      # Feature-specific types
└── index.ts    # Barrel export
```

---

## 4. Routing

All routes are defined in `src/app/router.tsx` using React Router v7's `createBrowserRouter`.

| Path            | Page                       | Auth required |
| --------------- | -------------------------- | ------------- |
| `/`             | → redirect to `/dashboard` | —             |
| `/login`        | Login                      | No            |
| `/signup`       | Sign Up                    | No            |
| `/dashboard`    | Dashboard                  | ✅            |
| `/profile`      | Profile                    | ✅            |
| `/cv`           | CV Manager                 | ✅            |
| `/journey`      | Journey Tracking           | ✅            |
| `/matching`     | Company Matching           | ✅            |
| `/appointments` | Appointments               | ✅            |
| `/messaging`    | Messaging                  | ✅            |
| `/resources`    | Resources                  | ✅            |

Protected routes are wrapped in `<ProtectedRoute>` which redirects to `/login` if no user is in `AuthContext`.

---

## 5. Design System (Tokens)

All colors, radii, and shadows come from `src/app/theme.ts` via `tokens`:

```ts
// Brand colors
tokens.color.primary[700]   // #0C7779 — main action color
tokens.color.primary[300]   // #3BC1A8 — hover tints

// Backgrounds & borders
tokens.color.background     // #F3F4F6 — page background
tokens.color.border         // #E5E7EB — card borders

// Text
tokens.color.text.primary   // #1F2937
tokens.color.text.secondary // #374151
tokens.color.text.muted     // #6B7280

// Status
tokens.color.success        // #0C7779
tokens.color.warning        // #fa7b41
tokens.color.error          // #f02929
tokens.color.info           // #2563EB

// Shape
tokens.radius.card          // 12px
tokens.radius.control       // 10px
tokens.shadow.sm / .md
```

---

## 6. Mock Data & API Layer

### How it works

Every service file (`features/{name}/api/index.ts`) exports async functions that are gated by `isMock()`:

```ts
export async function getItems(): Promise<Item[]> {
   if (isMock()) return mockGetItems(); // ← used now
   return realApiCall(); // ← plug in later
}
```

`isMock()` reads the `VITE_API_MODE` environment variable (default: `"mock"`).

### Switching to a real API

1. Create `.env.local`:
   ```
   VITE_API_MODE=real
   VITE_API_URL=https://your-api.com
   ```
2. Implement the `else` branch in each `api/index.ts` using `createApiClient` from `src/api/client.ts`.

### Simulating latency

All mock functions use `await sleep(ms)` to simulate realistic network delays (200–700ms depending on the operation).

---

## 7. Authentication

-  `AuthContext` (`src/contexts/auth-context.tsx`) holds `user`, `login()`, `logout()`.
-  On login, the token and user are saved to `localStorage`.
-  On app load, the context hydrates from `localStorage` before rendering (shows `<SplashScreen>` during hydration).
-  **Mock behavior:** Any email/password logs in successfully. Email containing `"error"` triggers an error state.

---

## 8. Pages Summary

| Page              | Key components                                                                                                                   | Main state                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Dashboard**     | StatsCard, JourneyProgress, NextAppointment, RecommendedMatches, ProfileCompletion                                               | 5 parallel API calls on mount                 |
| **Profile**       | ProfileHeaderCard, PersonalInfoSection, SkillsSection, LanguagesSection, ExperienceSection, EducationSection, PreferencesSection | `isEditMode`, `editedProfile`                 |
| **CV**            | CvEmptyState, CvUploadZone, CvFileCard                                                                                           | `cv`, `uploading`, `uploadProgress`           |
| **Matching**      | MatchFiltersBar, MatchCard, MatchDetailsDrawer                                                                                   | `matches[]`, `filters`, debounced search      |
| **Appointments**  | AppointmentCard, BookAppointmentDialog, RescheduleDialog, AppointmentDetailsDrawer                                               | `appointments[]`, tab filter                  |
| **Messaging**     | ConversationList, ChatWindow, NewChatDialog                                                                                      | `conversations[]`, `messageMap`, `selectedId` |
| **Journey**       | JourneySummaryCard, JourneyStepCard                                                                                              | `journeyData`                                 |
| **Resources**     | ResourceFiltersBar, ResourceCard, ResourceDetailsDrawer                                                                          | `resources[]`, `filters`, debounced search    |
| **Notifications** | NotificationsPanel (popover), NotificationItem                                                                                   | `unreadCount` in layout, panel-local state    |

---

## 9. Shared Components

### `Loading` — `src/shared/components/loading`

```tsx
<Loading variant="page" />              // full screen
<Loading variant="section" minHeight={300} />  // inside a card
<Loading variant="inline" />            // inside a button
```

### `ProtectedRoute`

Wraps any route that requires authentication. Reads from `AuthContext`.

### `DashboardLayout`

The single shell for all authenticated pages:

-  **AppBar**: search (expand-on-hover), notification bell (live badge + popover), user menu
-  **Sidebar**: collapsible (280px ↔ 72px), mobile drawer, active nav item highlight
-  **Content area**: `<Outlet />` with page background color

---

## 10. Environment Variables

| Variable        | Default  | Description                                                   |
| --------------- | -------- | ------------------------------------------------------------- |
| `VITE_API_MODE` | `"mock"` | `"mock"` or `"real"`                                          |
| `VITE_API_URL`  | —        | Base URL for real API (only needed when `VITE_API_MODE=real`) |
