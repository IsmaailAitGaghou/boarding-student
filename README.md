# 🎓 Boarding Student Portal

A modern student internship & boarding portal that helps students manage their entire journey — from profile setup and CV management to matching with companies, booking advisor appointments, messaging, tracking journey milestones, and browsing resources.

---

## ✨ Key Features

| Feature              | Description                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Dashboard**        | Personalized overview: stats, next appointment, recommended matches, journey progress, profile completion banner |
| **Profile**          | Manage personal info, skills, languages, education, experience, and preferences                                  |
| **CV**               | Upload, download, preview, and delete your CV with simulated upload progress                                     |
| **Matching**         | Browse and filter company internship matches by score, location, industry, type, and status; save or apply       |
| **Appointments**     | Book, reschedule, and cancel advisory appointments; view past appointments                                       |
| **Messaging**        | Chat with advisors per conversation; mark read/unread; start new conversations                                   |
| **Journey Tracking** | Visual step-by-step progress tracker synced with dashboard widget                                                |
| **Resources**        | Browse, bookmark, and open resources (PDFs, articles, videos) with category and type filters                     |
| **Notifications**    | Bell popover with real-time unread badge; filter All / Unread / Read; mark as read; navigate to linked pages     |

---

## 🛠 Tech Stack

| Layer            | Technology                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Framework        | [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)                                                        |
| Language         | [TypeScript 5.9](https://www.typescriptlang.org/) (strict)                                                            |
| UI Library       | [MUI v7 (Material UI)](https://mui.com/)                                                                              |
| Icons            | [@mui/icons-material](https://mui.com/material-ui/material-icons/)                                                    |
| Routing          | [React Router v7](https://reactrouter.com/)                                                                           |
| Forms            | [react-hook-form](https://react-hook-form.com/) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers) |
| Date handling    | [date-fns](https://date-fns.org/)                                                                                     |
| Charts           | [ApexCharts](https://apexcharts.com/) via react-apexcharts                                                            |
| HTTP client      | [Axios](https://axios-http.com/) (configured, active when `VITE_API_MODE=real`)                                       |
| State management | Local `useState` / `useEffect` per feature (no global store)                                                          |
| Linting          | ESLint 9 + typescript-eslint + eslint-plugin-react-hooks                                                              |
| Build            | Vite 7 with TypeScript project references                                                                             |

---

## 📋 Requirements

-  **Node.js** ≥ 18.x (LTS recommended — 20.x or 22.x)
-  **npm** ≥ 9.x (comes with Node)
-  No global CLI tools required

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/IsmaailAitGaghou/boarding-student.git
cd boarding-student

# 2. Install dependencies
npm install
```

---

## ▶️ Running Locally

```bash
# Development server (hot reload)
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## 🔐 Demo Credentials

The app runs entirely in **mock mode** by default (`VITE_API_MODE=mock`).
Any email/password combination works to log in — **no backend required**.

| Field    | Value           |
| -------- | --------------- |
| Email    | `any@email.com` |
| Password | `anything`      |

> **Special trigger:** Use an email containing `error` (e.g., `error@test.com`) to simulate a login error state.

To switch to real API mode, set the environment variable:

```bash
# .env.local
VITE_API_MODE=real
```

---

## 📸 Screenshots

### Dashboard

<!-- Add dashboard screenshot here -->

### Matching

<!-- Add matching page screenshot here -->

### Appointments

<!-- Add appointments page screenshot here -->

### Messaging

<!-- Add messaging page screenshot here -->

### Journey Tracking

<!-- Add journey tracking screenshot here -->

### Resources

<!-- Add resources page screenshot here -->

### Notifications Panel

<!-- Add notifications panel screenshot here -->

---

## 📁 Project Structure

```
src/
├── api/              # Base HTTP client, endpoints, env config
├── app/              # Router, providers, MUI theme
├── assets/           # Static assets
├── contexts/         # Auth context
├── features/         # Feature modules (one folder per feature)
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
│   ├── components/   # Loading, ProtectedRoute
│   └── layouts/      # DashboardLayout, nav-config
└── types/            # Global shared models
```

Each feature follows the same internal structure:

```
features/{name}/
├── api/        # Service functions (mock + real)
├── components/ # Feature-scoped UI components
├── pages/      # Page-level component
├── types/      # Feature-specific TypeScript types
└── index.ts    # Barrel export
```

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
   globalIgnores(["dist"]),
   {
      files: ["**/*.{ts,tsx}"],
      extends: [
         // Other configs...

         // Remove tseslint.configs.recommended and replace with this
         tseslint.configs.recommendedTypeChecked,
         // Alternatively, use this for stricter rules
         tseslint.configs.strictTypeChecked,
         // Optionally, add this for stylistic rules
         tseslint.configs.stylisticTypeChecked,

         // Other configs...
      ],
      languageOptions: {
         parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
         },
         // other options...
      },
   },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
   globalIgnores(["dist"]),
   {
      files: ["**/*.{ts,tsx}"],
      extends: [
         // Other configs...
         // Enable lint rules for React
         reactX.configs["recommended-typescript"],
         // Enable lint rules for React DOM
         reactDom.configs.recommended,
      ],
      languageOptions: {
         parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
         },
         // other options...
      },
   },
]);
```
