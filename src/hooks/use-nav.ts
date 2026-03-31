'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses better-auth's client-side hooks to check roles and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import { authClient } from '@/lib/auth-client';
import type { NavItem, NavGroup } from '@/types';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();
  const { data: activeMember } = authClient.useActiveMember();

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    const role = activeMember?.role;

    return {
      organization: activeOrg ?? undefined,
      user: session?.user ?? undefined,
      role: role ?? undefined,
      hasOrg: !!activeOrg
    };
  }, [activeOrg?.id, session?.user?.id, activeMember?.role]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => checkAccess(item, accessContext))
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          return {
            ...item,
            items: item.items.filter((childItem) =>
              checkAccess(childItem, accessContext)
            )
          };
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}

interface AccessContext {
  organization: unknown;
  user: unknown;
  role: string | undefined;
  hasOrg: boolean;
}

function checkAccess(item: NavItem, ctx: AccessContext): boolean {
  if (!item.access) {
    return true;
  }

  // Check requireOrg
  if (item.access.requireOrg && !ctx.hasOrg) {
    return false;
  }

  // Check permission (requires org context)
  if (item.access.permission) {
    if (!ctx.hasOrg) {
      return false;
    }
    // Permission checks use role-based access in better-auth
    // For now, owner and admin roles have all permissions
    if (ctx.role !== 'owner' && ctx.role !== 'admin') {
      return false;
    }
  }

  // Check role
  if (item.access.role) {
    if (!ctx.hasOrg) {
      return false;
    }
    if (ctx.role !== item.access.role) {
      return false;
    }
  }

  // Plan/feature checks require stripe plugin (US-008)
  // For now, show items and let page-level protection handle it
  if (item.access.plan || item.access.feature) {
    console.warn(
      `Plan/feature checks for navigation items require server-side verification. ` +
        `Item "${item.title}" will be shown, but page-level protection should be implemented.`
    );
  }

  return true;
}

/**
 * Hook to filter navigation groups based on RBAC (fully client-side)
 *
 * @param groups - Array of navigation groups to filter
 * @returns Filtered groups (empty groups are removed)
 */
export function useFilteredNavGroups(groups: NavGroup[]) {
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const filteredItems = useFilteredNavItems(allItems);

  return useMemo(() => {
    const filteredSet = new Set(filteredItems.map((item) => item.title));
    return groups
      .map((group) => ({
        ...group,
        items: filteredItems.filter((item) =>
          group.items.some((gi) => gi.title === item.title && filteredSet.has(gi.title))
        )
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, filteredItems]);
}
