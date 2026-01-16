Developer Practices for Quiz App

# 1️⃣ Project Structure

We follow a type-based folder structure:

src/
├── components/ → Reusable UI components
├── hooks/ → Custom hooks for logic/state
├── services/ → API/service calls
├── pages/ → Route-level components
├── utils/ → Generic reusable utility functions
├── constants/ → Global constants
├── assets/ → Images, icons, fonts
├── styles/ → Global and shared styles
├── App.tsx → Main app
└── main.tsx → Entry point
docs/
└── dev-practice.md → This file

Rule of thumb:

Components render, hooks manage logic, services handle API calls, pages orchestrate everything.

# 2️⃣ File & Folder Naming Conventions

Type File Naming
Component / Page PascalCase.tsx (Button.tsx, Login.tsx)
Hook useXxx.ts (useAuth.ts)
Service xxx.service.ts (auth.service.ts)
Utils camelCase.ts (formatDate.ts)
Constants snake_case.ts or PascalCase (routes.ts)
Index / Barrel index.ts (components/index.ts)
Folders lowercase (components/, hooks/)

Notes:

Pages at root do not use index.ts

Keep feature-specific helpers/constants inside their folder

# 3️⃣ Component Practices

Components should be pure and reusable

Avoid API calls in components

Props should be typed (use TypeScript)

Prefer functional components and hooks

Keep components small & focused

# 4️⃣ Hooks Practices

Hooks orchestrate state, effects, and services

Start all hook names with use

No JSX inside hooks

Reuse hooks across pages/components

Example:

```js
export function useAuth() {
const [user, setUser] = useState(null);
const signIn = async (email, pass) => { ... };
return { user, signIn };
}
```

# 5️⃣ Services Practices

Services are pure JS/TS functions for external communication

No React imports in services

Centralize API calls in services/

Example:

export async function login(email: string, password: string) {
return apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

Hooks call services; components call hooks

# 6️⃣ Pages Practices

Each page corresponds to one route

Pages compose hooks and components

Keep pages thin, avoid complex logic

Example:

```js
export default function Login() {
  const { signIn, loading } = useAuth();
  return (
    <Button onClick={() => signIn("a@b.com", "1234")}>
      {loading ? "Loading..." : "Login"}
    </Button>
  );
}
```

# 7️⃣ Utils / Helpers

Global utilities: utils/

Feature-specific helpers: inside feature/page folder

Avoid business logic inside utils

Keep functions small & pure

# 8️⃣ Constants

Global constants in constants/

Feature-specific constants near the feature

Use UPPER_SNAKE_CASE or grouped objects

Example:

```js
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
};
```

# 9️⃣ API / Dependency Flow

pages
↓
components → hooks → services → API

Rules:

Services never call hooks/components

Hooks call services only

Components call hooks only

Pages call hooks and compose components

# 🔟 Dev Environment Practices

Use TypeScript

Use ESLint + Prettier for consistency

Commit package-lock.json

Do not commit .env files (use .env.example)

Use docs/ for documentation, not src/

# 11️⃣ Git Practices

Use feature branches: feature/login, bugfix/api-error

Write clear commit messages

PRs must pass linting & tests

Keep main/master stable

# 12️⃣ Misc Practices

Keep components small (<200 lines)

Prefer composition over inheritance

Reuse hooks and services; don’t duplicate

Lazy-load large pages/components when possible

Always type API responses and props

# 13️⃣ Recommended Resources

React Docs: https://reactjs.org/docs/getting-started.html

TypeScript Handbook: https://www.typescriptlang.org/docs/

Vite Docs: https://vitejs.dev/

React Router: https://reactrouter.com/
