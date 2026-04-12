/**
 * Auth feature flags
 *
 * Derives from NEXT_PUBLIC_* environment variables so features can be toggled
 * per deployment without code changes. Works on both server and client.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_AUTH_ORGANIZATIONS=true
 *   NEXT_PUBLIC_AUTH_ADMIN=true
 */

export const authFeatures = {
  /** Multi-tenant organization support (org switcher, workspaces, teams, RBAC) */
  organizations: process.env.NEXT_PUBLIC_AUTH_ORGANIZATIONS !== 'false',

  /** Admin plugin (user management, ban/unban, role assignment) */
  admin: process.env.NEXT_PUBLIC_AUTH_ADMIN !== 'false'
} as const;
