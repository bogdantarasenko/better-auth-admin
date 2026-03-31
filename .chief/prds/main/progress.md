## Codebase Patterns
- Use `npm install` (not bun) — bun is not available in this environment
- better-auth CLI schema generation: `echo "y" | npx @better-auth/cli@latest generate --config ./src/lib/auth.ts --output ./src/lib/auth-schema.ts` (requires piped "y" confirmation)
- Drizzle push to SQLite: `npx drizzle-kit push` (uses drizzle.config.ts at project root)
- Auth files live in `src/lib/`: auth.ts (server), auth-client.ts (client), auth-schema.ts (drizzle schema), db.ts (drizzle instance)
- API auth route: `src/app/api/auth/[...all]/route.ts`
- SQLite database at `./sqlite.db` (gitignored via `*.db` pattern)
- Typecheck: `npx tsc --noEmit` — no test suite exists, so typecheck is the main quality gate
- better-auth session shape: `authClient.useSession()` returns `{ data: session }` where `session.user` has `name`, `email`, `image` (NOT Clerk's `fullName`, `emailAddresses`, `imageUrl`)
- Sign-out pattern: `await authClient.signOut()` then `router.push('/auth/sign-in')` — no component wrapper needed
- AuthUIProvider redirect prop is `redirectTo` (string), NOT `redirects` (object) — e.g. `redirectTo='/dashboard/overview'`
- Auth pages: single dynamic route at `src/app/auth/[path]/page.tsx` using `<AuthView path={path} />` + `generateStaticParams` from `authViewPaths`
- Server-side session check: `auth.api.getSession({ headers: await headers() })` from `@/lib/auth` — returns session or null
- Middleware route protection: `getSessionCookie(req)` from `better-auth/cookies` — lightweight cookie check, no DB hit

---

## 2026-03-31 - US-001
- What was implemented: better-auth server config with SQLite via Drizzle adapter, auth client, API catch-all route, database schema generation and migration
- Files changed:
  - `package.json` / `package-lock.json` — added better-auth, drizzle-orm, better-sqlite3, drizzle-kit, @types/better-sqlite3
  - `src/lib/auth.ts` — betterAuth() config with Drizzle adapter, emailAndPassword, nextCookies plugin
  - `src/lib/auth-client.ts` — createAuthClient() for client-side usage
  - `src/lib/db.ts` — Drizzle ORM instance with better-sqlite3 driver
  - `src/lib/auth-schema.ts` — Generated schema (user, session, account, verification tables)
  - `src/app/api/auth/[...all]/route.ts` — toNextJsHandler(auth) catch-all
  - `drizzle.config.ts` — Drizzle Kit config for SQLite
  - `env.example.txt` — Added BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_PATH
  - `.gitignore` — Added *.db pattern
- **Learnings for future iterations:**
  - better-auth CLI `generate` command prompts for confirmation — pipe "y" to auto-confirm
  - The drizzle adapter import is `better-auth/adapters/drizzle` (built into better-auth, not a separate package)
  - `nextCookies()` plugin is from `better-auth/next-js`
  - `toNextJsHandler` is from `better-auth/next-js`
  - `createAuthClient` is from `better-auth/react`
  - The generated schema includes relations — db.ts should use `drizzle(sqlite, { schema })` for relational queries
---

## 2026-03-31 - US-002
- What was implemented: AuthUIProvider replaces ClerkProvider in providers.tsx, better-auth-ui CSS imported
- Files changed:
  - `package.json` / `package-lock.json` — added @daveyplate/better-auth-ui
  - `src/components/layout/providers.tsx` — replaced ClerkProvider with AuthUIProvider (authClient, navigate, replace, onSessionChange, Link props)
  - `src/styles/globals.css` — added `@import '@daveyplate/better-auth-ui/css'`
- **Learnings for future iterations:**
  - AuthUIProvider requires: authClient, navigate (router.push), replace (router.replace), onSessionChange (router.refresh), Link (next/link)
  - CSS import for Tailwind v4: `@import '@daveyplate/better-auth-ui/css'`
  - Auth routes use `<AuthView path={path} />` from `@daveyplate/better-auth-ui` with dynamic `[path]` param
  - Static params generated via `authViewPaths` from `@daveyplate/better-auth-ui/server`
  - better-auth-ui docs: https://better-auth-ui.com/integrations/next-js
---

## 2026-03-31 - US-003
- What was implemented: Replaced Clerk sign-in/sign-up pages with better-auth-ui AuthView dynamic route
- Files changed:
  - `src/app/auth/[path]/page.tsx` — New dynamic route rendering `<AuthView path={path} />` with `generateStaticParams` from `authViewPaths`
  - `src/components/layout/providers.tsx` — Added `redirectTo='/dashboard/overview'` prop to AuthUIProvider
  - Deleted `src/app/auth/sign-in/[[...sign-in]]/page.tsx` — Old Clerk catch-all route
  - Deleted `src/app/auth/sign-up/[[...sign-up]]/page.tsx` — Old Clerk catch-all route
  - Deleted `src/features/auth/components/sign-in-view.tsx` — Clerk SignIn wrapper
  - Deleted `src/features/auth/components/sign-up-view.tsx` — Clerk SignUp wrapper
- **Learnings for future iterations:**
  - AuthUIProvider `redirectTo` prop (string) controls post-sign-in redirect, NOT `redirects` (object) — the docs may show `redirects` but the actual type uses `redirectTo`
  - `authViewPaths` from `@daveyplate/better-auth-ui/server` generates all needed static paths (sign-in, sign-up, forgot-password, etc.)
  - `dynamicParams = false` should be exported to prevent unknown auth paths
  - The `interactive-grid.tsx`, `user-auth-form.tsx`, and `github-auth-button.tsx` in features/auth/components were kept — they're not Clerk-specific
---

## 2026-03-31 - US-004
- What was implemented: Replaced Clerk server-side auth checks with better-auth session validation and created middleware for route protection
- Files changed:
  - `src/app/page.tsx` — Replaced `auth()` from `@clerk/nextjs/server` with `auth.api.getSession({ headers: await headers() })` from `@/lib/auth`
  - `src/app/dashboard/page.tsx` — Same replacement as above
  - `middleware.ts` (new, project root) — Created middleware using `getSessionCookie()` from `better-auth/cookies` to protect `/dashboard(.*)` routes
- **Learnings for future iterations:**
  - `getSessionCookie()` from `better-auth/cookies` is the lightweight cookie check for middleware (no DB hit)
  - `auth.api.getSession({ headers: await headers() })` is the server-side session validation pattern (full DB check)
  - Middleware file goes at project root (`middleware.ts`), not in `src/`
  - The old Clerk middleware was in `src/proxy.ts` — still exists but is no longer used (will be cleaned up in US-010)
  - `@clerk/nextjs/server` imports remain in other files (use-nav.ts, etc.) — those are for later stories
---

## 2026-03-31 - US-005
- What was implemented: Replaced Clerk user UI components with better-auth equivalents in app-sidebar, user-nav, and UserAvatarProfile
- Files changed:
  - `src/components/user-avatar-profile.tsx` — Updated interface: `imageUrl` → `image`, `fullName` → `name`, `emailAddresses` → `email`
  - `src/components/layout/app-sidebar.tsx` — Replaced `useUser()`/`useOrganization()`/`SignOutButton` from `@clerk/nextjs` with `authClient.useSession()` and `authClient.signOut()`
  - `src/components/layout/user-nav.tsx` — Same Clerk-to-better-auth replacement as sidebar
- **Learnings for future iterations:**
  - `authClient.useSession()` returns `{ data: session }` where `session.user` has `name` (string), `email` (string), `image` (string | null) — different shape from Clerk's user object
  - Sign-out is `await authClient.signOut()` — it's a promise, not a component. Follow with `router.push('/auth/sign-in')` for redirect
  - The `organization` conditional on billing menu item was removed since org support is handled in US-006 — billing link now always shows
  - Clerk imports still remain in `use-nav.ts` and `org-switcher.tsx` — those are for US-006/US-007
---
