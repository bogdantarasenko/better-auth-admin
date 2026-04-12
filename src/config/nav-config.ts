import { NavGroup } from '@/types';
import { authFeatures } from './auth-features';

/**
 * Navigation configuration with RBAC support
 *
 * Items are organized into groups, each rendered with a SidebarGroupLabel.
 * Use the `access` property to control visibility based on RBAC.
 * Use `authFeature` to tie items to auth feature flags (organizations, admin).
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      ...(authFeatures.organizations
        ? [
            {
              title: 'Workspaces',
              url: '/dashboard/workspaces',
              icon: 'workspace' as const,
              isActive: false,
              items: []
            },
            {
              title: 'Teams',
              url: '/dashboard/workspaces/team',
              icon: 'teams' as const,
              isActive: false,
              items: [],
              access: { requireOrg: true }
            }
          ]
        : []),
      ...(authFeatures.admin
        ? [
            {
              title: 'Users',
              url: '/dashboard/users',
              icon: 'teams' as const,
              shortcut: ['u', 'u'] as [string, string],
              isActive: false,
              items: []
            }
          ]
        : [])
    ]
  },
  {
    label: 'Elements',
    items: []
  }
];
