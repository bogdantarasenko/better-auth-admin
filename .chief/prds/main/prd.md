# PRD: Replace Clerk with Better-Auth

## Introduction

Fully replace Clerk (third-party auth service) with better-auth (self-hosted, TypeScript-first auth library) across the entire Next.js dashboard. This migrates authentication, organizations, RBAC, and billing from a SaaS dependency to an in-house solution using SQLite, better-auth plugins, and better-auth-ui components. The result is zero vendor lock-in, no per-user pricing, and full control over auth data.

## Goals

- Remove all Clerk dependencies (`@clerk/nextjs`, `@clerk/themes`) from the project
- Set up better-auth with SQLite database (via Drizzle ORM + `better-sqlite3`)
- Support email/password authentication
- Replicate organization/workspace functionality using the organization plugin
- Replicate role-based access control (admin, member, viewer) using better-auth's `createAccessControl`
- Replicate billing/subscription functionality using `@better-auth/stripe`
- Use better-auth-ui (`@daveyplate/better-auth-ui`) for pre-built UI components (sign-in, sign-up, user button, org switcher, settings)
- Build custom shadcn/ui components only where better-auth-ui doesn't provide coverage
- Maintain all existing RBAC nav filtering logic (just swap the data source)
- Zero downtime in developer experience — app works end-to-end after migration

## User Stories

### US-001: Set up better-auth server config and database
**Priority:** 1
**Description:** As a developer, I need the better-auth server configuration with SQLite so that auth data is stored locally and all plugins are initialized.

**Acceptance Criteria:**
- [ ] `lib/auth.ts` created with `betterAuth()` config: SQLite via Drizzle adapter, `emailAndPassword: { enabled: true }`, `nextCookies()` plugin
- [ ] Drizzle ORM configured with `better-sqlite3` driver and `@libsql/client`
- [ ] Database schema generated via `npx auth@latest generate` and migrations applied via `drizzle-kit`
- [ ] Core tables exist: `user`, `session`, `account`, `verification`
- [ ] `lib/auth-client.ts` created with `createAuthClient()` for client-side usage
- [ ] API catch-all route at `app/api/auth/[...all]/route.ts` using `toNextJsHandler(auth)`
- [ ] Environment variables documented in `env.example.txt` (database path, auth secret)
- [ ] Typecheck passes

### US-002: Set up better-auth-ui provider
**Priority:** 2
**Description:** As a developer, I need the AuthUIProvider wired into the app so that better-auth-ui components work throughout the dashboard.

**Acceptance Criteria:**
- [ ] `@daveyplate/better-auth-ui` installed
- [ ] `@import "@daveyplate/better-auth-ui/css"` added to global CSS (if TailwindCSS v4)
- [ ] `<AuthUIProvider>` wraps the app in `providers.tsx`, replacing `<ClerkProvider>`
- [ ] Provider configured with `authClient`, `navigate`, `replace`, `onSessionChange`, and `Link`
- [ ] `<ClerkProvider>` and all `@clerk/themes` imports removed from `providers.tsx`
- [ ] Typecheck passes

### US-003: Replace sign-in and sign-up pages
**Priority:** 3
**Description:** As a user, I want to sign in and sign up with email/password so that I can access the dashboard.

**Acceptance Criteria:**
- [ ] Auth routes restructured: `app/auth/[path]/page.tsx` renders `<AuthView />` from better-auth-ui
- [ ] Sign-in page works at `/auth/sign-in`
- [ ] Sign-up page works at `/auth/sign-up`
- [ ] Forgot password flow works at `/auth/forgot-password`
- [ ] Successful sign-in redirects to `/dashboard/overview`
- [ ] Clerk `<SignIn>` and `<SignUp>` components removed from `src/features/auth/components/`
- [ ] Old Clerk catch-all routes (`[[...sign-in]]`, `[[...sign-up]]`) removed
- [ ] Typecheck passes

### US-004: Replace server-side auth checks
**Priority:** 4
**Description:** As a developer, I need server-side session validation so that unauthenticated users are redirected to sign-in.

**Acceptance Criteria:**
- [ ] `app/dashboard/page.tsx` uses `auth.api.getSession({ headers: await headers() })` instead of Clerk's `auth()`
- [ ] `app/page.tsx` uses the same pattern
- [ ] Unauthenticated users redirected to `/auth/sign-in`
- [ ] Middleware created at `middleware.ts` using `getSessionCookie()` for fast cookie-based route protection on `/dashboard/*`
- [ ] All imports of `@clerk/nextjs` server functions removed
- [ ] Typecheck passes

### US-005: Replace user UI components (avatar, nav, sign-out)
**Priority:** 5
**Description:** As a user, I want to see my profile info in the sidebar and header and be able to sign out.

**Acceptance Criteria:**
- [ ] `app-sidebar.tsx` uses better-auth session data (via `authClient.useSession()`) instead of Clerk's `useUser()`
- [ ] `user-nav.tsx` uses better-auth session data instead of Clerk's `useUser()`
- [ ] Sign-out uses `authClient.signOut()` instead of Clerk's `<SignOutButton>`
- [ ] `<UserButton />` from better-auth-ui used where appropriate (or custom implementation using session data)
- [ ] User name and avatar display correctly
- [ ] Typecheck passes

### US-006: Add organization plugin and replace org features
**Priority:** 6
**Description:** As a user, I want to create and switch between organizations so that I can manage team workspaces.

**Acceptance Criteria:**
- [ ] Organization plugin added to `lib/auth.ts` with roles: owner, admin, member
- [ ] `organizationClient()` plugin added to `lib/auth-client.ts`
- [ ] Organization tables generated and migrated (`organization`, `member`, `invitation`)
- [ ] `<OrganizationSwitcher />` from better-auth-ui replaces custom `org-switcher.tsx` (or rebuilt with better-auth data)
- [ ] `/dashboard/workspaces` page uses better-auth-ui org components instead of Clerk's `<OrganizationList>`
- [ ] `/dashboard/workspaces/team` page uses better-auth-ui `<OrganizationSettingsCards>` + `<OrganizationMembersCard>` instead of Clerk's `<OrganizationProfile>`
- [ ] Users can create, switch, and manage organizations
- [ ] Typecheck passes

### US-007: Replace RBAC and nav filtering
**Priority:** 7
**Description:** As a developer, I need role-based access control so that navigation items and pages are restricted by role, permission, and plan.

**Acceptance Criteria:**
- [ ] `createAccessControl()` configured with statements matching current permissions (e.g., `org:teams:manage`)
- [ ] Roles defined: owner, admin, member (matching current Clerk roles)
- [ ] `use-nav.ts` hook updated: replace `useOrganization()` and `useUser()` from Clerk with better-auth equivalents (`authClient.useActiveOrganization()`, `authClient.useSession()`)
- [ ] `requireOrg` check uses better-auth active organization state
- [ ] `permission` check uses `authClient.organization.hasPermission()`
- [ ] `role` check uses active member role from better-auth
- [ ] `plan` check uses subscription data from better-auth stripe plugin
- [ ] `/dashboard/exclusive` page uses better-auth permission check instead of Clerk's `<Protect>`
- [ ] Nav items still filter correctly based on org, role, and plan
- [ ] Typecheck passes

### US-008: Add Stripe billing plugin and replace billing page
**Priority:** 8
**Description:** As a user, I want to manage my organization's subscription plan so that I can access premium features.

**Acceptance Criteria:**
- [ ] `@better-auth/stripe` installed and configured in `lib/auth.ts` with Stripe client and webhook secret
- [ ] `stripeClient()` plugin added to `lib/auth-client.ts`
- [ ] Subscription plans defined (matching current Pro/Free tiers)
- [ ] Webhook route configured (auto-handled by better-auth at `/api/auth/stripe/webhook`)
- [ ] `/dashboard/billing` page rebuilt with custom shadcn UI showing plans and subscription status (replaces Clerk's `<PricingTable>`)
- [ ] Users can subscribe, upgrade, cancel via Stripe Checkout
- [ ] Subscription status accessible for RBAC plan checks
- [ ] Environment variables added: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, plan price IDs
- [ ] Typecheck passes

### US-009: Replace user profile/settings page
**Priority:** 9
**Description:** As a user, I want to manage my account settings (name, email, password) from the dashboard.

**Acceptance Criteria:**
- [ ] `/dashboard/profile` page uses `<AccountSettingsCards />` and `<SecuritySettingsCards />` from better-auth-ui instead of Clerk's `<UserProfile>`
- [ ] User can update name and avatar
- [ ] User can change password
- [ ] Typecheck passes

### US-010: Remove all Clerk dependencies and clean up
**Priority:** 10
**Description:** As a developer, I want all Clerk code fully removed so there are no dead imports, unused packages, or stale config.

**Acceptance Criteria:**
- [ ] `@clerk/nextjs` and `@clerk/themes` uninstalled from `package.json`
- [ ] Zero imports from `@clerk/*` anywhere in the codebase (verified via grep)
- [ ] Clerk environment variables removed from `env.example.txt`
- [ ] `docs/clerk_setup.md` removed or replaced with `docs/auth_setup.md` for better-auth
- [ ] `docs/nav-rbac.md` updated to reference better-auth instead of Clerk
- [ ] `CLAUDE.md` and `AGENTS.md` updated to reference better-auth
- [ ] `PermissionCheck` type in `src/types/index.ts` updated if needed
- [ ] App builds successfully (`next build`)
- [ ] Typecheck passes
- [ ] No runtime errors on sign-in, sign-up, dashboard, org switching, billing, profile pages

## Functional Requirements

- FR-1: The system must authenticate users via email and password using better-auth's `emailAndPassword` plugin
- FR-2: The system must store all auth data (users, sessions, accounts, organizations, subscriptions) in a local SQLite database via Drizzle ORM
- FR-3: The system must expose auth API routes at `/api/auth/[...all]` using `toNextJsHandler`
- FR-4: The system must protect `/dashboard/*` routes via Next.js middleware using `getSessionCookie()` — redirect unauthenticated users to `/auth/sign-in`
- FR-5: The system must support creating, switching, and managing organizations with member roles (owner, admin, member)
- FR-6: The system must filter navigation items based on active organization, user role, permissions, and subscription plan — using the existing `useFilteredNavGroups()` hook pattern
- FR-7: The system must integrate with Stripe for subscription billing at the organization level, supporting at minimum Free and Pro plan tiers
- FR-8: The system must handle Stripe webhooks for subscription lifecycle events (created, updated, cancelled)
- FR-9: The system must render auth UI (sign-in, sign-up, user button, org switcher, settings) using better-auth-ui components styled with the project's shadcn/ui theme
- FR-10: The system must provide server-side session access via `auth.api.getSession({ headers })` for server components and server actions

## Non-Goals

- No social OAuth providers (Google, GitHub, etc.) — email/password only for now
- No magic link or passwordless authentication
- No two-factor authentication (can be added later via plugin)
- No user data migration from Clerk — this is a fresh start (dev/starter template)
- No custom auth UI from scratch — use better-auth-ui where possible
- No Turso cloud setup — use local SQLite file for simplicity
- No SSO, SAML, or enterprise auth features
- No changes to non-auth features (data tables, charts, forms, etc.)

## Design Considerations

- Use better-auth-ui components (`@daveyplate/better-auth-ui`) for: sign-in, sign-up, forgot password, user button/avatar, org switcher, account settings, security settings, org settings/members
- Build custom shadcn/ui components for: billing/pricing page (since better-auth-ui doesn't include a pricing table equivalent to Clerk's)
- The org switcher in the sidebar should match the current UX: show active org, list all orgs, allow switching
- Auth pages should maintain the current centered layout at `/auth/*`
- Account/profile settings should maintain the current dashboard layout

## Technical Considerations

- **Database:** SQLite via `better-sqlite3` + Drizzle ORM. Schema generated by better-auth CLI, migrations via `drizzle-kit`
- **Packages to add:** `better-auth`, `@better-auth/stripe`, `@daveyplate/better-auth-ui`, `better-sqlite3`, `drizzle-orm`, `drizzle-kit`
- **Packages to remove:** `@clerk/nextjs`, `@clerk/themes`
- **Auth secret:** `BETTER_AUTH_SECRET` env var required (generate via `npx auth@latest generate-secret`)
- **13+ files to modify:** `providers.tsx`, `app-sidebar.tsx`, `user-nav.tsx`, `org-switcher.tsx`, `use-nav.ts`, `sign-in-view.tsx`, `sign-up-view.tsx`, `profile-view-page.tsx`, `billing/page.tsx`, `exclusive/page.tsx`, `workspaces/page.tsx`, `workspaces/team/page.tsx`, `dashboard/page.tsx`, `app/page.tsx`
- **New files:** `lib/auth.ts`, `lib/auth-client.ts`, `lib/db.ts`, `app/api/auth/[...all]/route.ts`, `middleware.ts`, `drizzle.config.ts`, DB schema files
- **better-auth-ui requires:** `<AuthUIProvider>` wrapping the app, CSS import for Tailwind v4
- **Cookie-based middleware** (`getSessionCookie`) is fast (no DB hit) — use for route protection; full `getSession` for data access in server components

## Success Metrics

- Zero imports from `@clerk/*` in the codebase
- App builds and type-checks cleanly (`next build` succeeds)
- User can sign up, sign in, and sign out without errors
- User can create an organization, invite members, and switch between orgs
- Navigation items correctly hide/show based on org membership, role, and plan
- Billing page displays plans and redirects to Stripe Checkout
- Profile/settings page allows updating user info and password
- All auth data persists in local SQLite database across server restarts

## Open Questions

- Should we seed a default admin user and organization for local development?
- What Stripe price IDs should be used for Free/Pro plans, or should we create test products?
- Should the `viewer` role from Clerk RBAC be mapped to `member` in better-auth, or should we define a custom `viewer` role?
- Does better-auth-ui's `<OrganizationSwitcher>` fit the sidebar design, or do we need a custom component using better-auth data?
- Should we add a Drizzle Studio script (`drizzle-kit studio`) for inspecting the local DB during development?
