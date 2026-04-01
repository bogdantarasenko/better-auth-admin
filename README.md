<h1 align="center">Better Auth Admin Dashboard</h1>

<div align="center">Admin dashboard starter built with Next.js 16, better-auth, shadcn/ui, Tailwind CSS, TypeScript</div>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/better--auth-1.5-blue" alt="better-auth" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-latest-black" alt="shadcn/ui" />
</p>

## Overview

A production-ready **admin dashboard** built with **Next.js 16, better-auth, Shadcn UI, TypeScript, and Tailwind CSS**. Designed for **SaaS apps, internal tools, and admin panels** with self-hosted authentication, multi-tenant workspaces, and Stripe billing out of the box.

### Tech Stack

- Framework - [Next.js 16](https://nextjs.org/16)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [better-auth](https://www.better-auth.com) (self-hosted, SQLite via Drizzle)
- Auth UI - [better-auth-ui](https://better-auth-ui.com/)
- Billing - [Stripe](https://stripe.com) via [@better-auth/stripe](https://www.better-auth.com/docs/plugins/stripe)
- Error tracking - [Sentry](https://sentry.io/for/nextjs/)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Charts - [Recharts](https://recharts.org)
- Schema Validations - [Zod](https://zod.dev)
- Data Fetching - [TanStack React Query](https://tanstack.com/query)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://tanstack.com/table)
- Forms - [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linter / Formatter - [OxLint](https://oxc.rs/docs/guide/usage/linter) / [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Themes - [tweakcn](https://tweakcn.com/)

## Features

- **Admin dashboard layout** — sidebar, header, content area
- **Analytics overview** — cards and charts with parallel route loading
- **Data tables** — React Query prefetch, client-side cache, search, filter & pagination
- **Authentication** — self-hosted via better-auth with better-auth-ui components
- **Multi-tenant workspaces** — organization plugin (create, switch, manage teams)
- **Billing & subscriptions** — Stripe integration via @better-auth/stripe
- **RBAC navigation** — client-side nav filtering by org, role, permission, plan
- **Multi-theme support** — 10+ themes with easy switching
- **Feature-based folder structure** — scalable project organization
- **Command+K** — global search and navigation via kbar

## Pages

| Page | Description |
| :--- | :---------- |
| Sign In / Sign Up | Authentication via better-auth-ui components |
| Dashboard Overview | Analytics cards with Recharts, parallel routes for independent loading |
| Product List | TanStack Table + React Query with nuqs URL state for search, filter, pagination |
| Create/Edit Product | TanStack Form + Zod with useMutation and cache invalidation |
| Users | Users table with React Query + nuqs pattern |
| Profile | Account management via better-auth-ui components |
| Workspaces | Organization management via better-auth-ui `<OrganizationsCard />` |
| Team Management | Member/role management via better-auth-ui `<OrganizationSettingsCards />` |
| Billing & Plans | Subscription management via Stripe |
| Not Found | Custom 404 page |

## Project Structure

```plaintext
src/
├── app/                           # Next.js App Router
│   ├── auth/                      # Auth pages (sign-in, sign-up)
│   ├── dashboard/                 # Dashboard routes
│   │   ├── overview/              # Analytics with parallel routes
│   │   ├── product/               # Product CRUD pages
│   │   ├── users/                 # Users table
│   │   ├── workspaces/            # Org management & teams
│   │   ├── billing/               # Billing & plans
│   │   └── profile/               # User profile
│   └── api/                       # API routes
│
├── components/                    # Shared components
│   ├── ui/                        # shadcn/ui primitives
│   ├── layout/                    # Layout (sidebar, header)
│   ├── themes/                    # Theme system
│   └── kbar/                      # Command+K interface
│
├── features/                      # Feature-based modules
│   ├── auth/                      # Auth components
│   ├── overview/                  # Dashboard analytics
│   ├── products/                  # Product management (React Query + nuqs)
│   ├── users/                     # User management (React Query + nuqs)
│   └── profile/                   # Profile management
│
├── lib/                           # Core utilities
├── hooks/                         # Custom hooks
├── config/                        # Navigation config
├── constants/                     # Mock data
├── styles/                        # Global CSS & themes
└── types/                         # TypeScript types
```

## Getting Started

> [!NOTE]
> Requires Node.js 18+ or Bun.

```bash
git clone https://github.com/bogdantarasenko/better-auth-admin.git
cd better-auth-admin
npm install
```

Create a `.env.local` file:

```bash
cp env.example.txt .env.local
```

Configure the required environment variables (see below), then:

```bash
npm run dev
```

The app will be available at http://localhost:3000.

### Environment Variables

**Required — Authentication (better-auth)**

```env
BETTER_AUTH_SECRET=    # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
DATABASE_PATH=./sqlite.db
```

**Optional — Stripe Billing**

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_FREE_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_PRO_ANNUAL_PRICE_ID=
```

**Optional — Sentry Error Tracking**

```env
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ORG=
NEXT_PUBLIC_SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DISABLED="true"  # Set to "true" to disable in dev
```

For detailed auth setup (including organizations and teams), see [docs/auth_setup.md](./docs/auth_setup.md).

## Cleanup

Remove optional features you don't need:

```bash
node scripts/cleanup.js --interactive   # interactive mode
node scripts/cleanup.js --list          # see available features
node scripts/cleanup.js --dry-run notifications  # preview before removing
node scripts/cleanup.js notifications            # remove specific features
```

Run `node scripts/cleanup.js --help` for all options. Delete `scripts/cleanup.js` when you're done.

## Deploy

Production-ready Dockerfiles included (`Dockerfile` for Node.js, `Dockerfile.bun` for Bun) using standalone output mode.

```bash
# Build
docker build -t better-auth-admin .

# Run
docker run -d -p 3000:3000 \
  -e BETTER_AUTH_SECRET=your-secret \
  -e BETTER_AUTH_URL=https://your-domain.com \
  -e DATABASE_PATH=/data/sqlite.db \
  --restart unless-stopped \
  better-auth-admin
```

For all deployment options, see the [Next.js Deployment Documentation](https://nextjs.org/docs/app/getting-started/deploying).

## Documentation

- [Auth Setup](./docs/auth_setup.md) — better-auth configuration guide
- [Navigation RBAC](./docs/nav-rbac.md) — access control documentation
- [Themes](./docs/themes.md) — theme customization guide
- [Forms](./docs/forms.md) — form system documentation

## Credits

Based on [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) by [Kiran](https://github.com/Kiranism).

## License

MIT
