import type { InfobarContent } from '@/components/ui/infobar';

export const workspacesInfoContent: InfobarContent = {
  title: 'Workspaces Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Workspaces page allows you to manage your workspaces and switch between them. This feature is powered by the better-auth organization plugin, which enables multi-tenant workspace management. You can view all available workspaces, create new ones, and switch your active workspace.',
      links: [
        {
          title: 'better-auth Organization Plugin',
          url: 'https://www.better-auth.com/docs/plugins/organization'
        }
      ]
    },
    {
      title: 'Creating Workspaces',
      description:
        'To create a new workspace, click the "Create Organization" button. You will be prompted to enter a workspace name and configure initial settings. Once created, you can switch to the new workspace and start managing it.',
      links: []
    },
    {
      title: 'Switching Workspaces',
      description:
        'You can switch between workspaces by clicking on a workspace in the list. The selected workspace becomes your active organization context, and all organization-specific features will use this workspace.',
      links: []
    },
    {
      title: 'Workspace Features',
      description:
        'Each workspace operates independently with its own team members, roles, and permissions. This allows you to manage multiple projects or teams within a single account while keeping their data and settings separate.',
      links: []
    },
    {
      title: 'Server-Side Permission Checks',
      description:
        'This application uses better-auth for multi-tenant authentication. Server-side session checks ensure that users can only access resources for their active organization.',
      links: [
        {
          title: 'better-auth Organization Plugin',
          url: 'https://www.better-auth.com/docs/plugins/organization'
        }
      ]
    }
  ]
};

export const teamInfoContent: InfobarContent = {
  title: 'Team Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Team Management page allows you to manage your workspace team, including members, roles, security settings, and more. This page provides comprehensive organization management through better-auth-ui components.',
      links: [
        {
          title: 'better-auth Organization Plugin',
          url: 'https://www.better-auth.com/docs/plugins/organization'
        }
      ]
    },
    {
      title: 'Managing Team Members',
      description:
        'You can add, remove, and manage team members from this page. Invite new members by email, assign roles, and control their access levels. Each member can have different permissions based on their role.',
      links: []
    },
    {
      title: 'Roles and Permissions',
      description:
        'Roles are configured in the better-auth server config (src/lib/auth.ts). Available roles include owner, admin, and member. Roles define what actions team members can perform within the workspace.',
      links: [
        {
          title: 'better-auth Organization Plugin',
          url: 'https://www.better-auth.com/docs/plugins/organization'
        }
      ]
    },
    {
      title: 'Security Settings',
      description:
        "Manage security settings for your workspace, including authentication requirements, session management, and access controls. These settings help protect your organization's data and resources.",
      links: []
    },
    {
      title: 'Organization Settings',
      description:
        'Configure general organization settings such as name, logo, and other workspace preferences. These settings apply to the entire workspace and affect all team members.',
      links: []
    },
    {
      title: 'Navigation RBAC System',
      description:
        'The application includes a fully client-side navigation filtering system using the `useNav` hook. It supports `requireOrg`, `permission`, and `role` checks for instant access control. Navigation items are configured in `src/config/nav-config.ts` with `access` properties.',
      links: []
    }
  ]
};

export const usersInfoContent: InfobarContent = {
  title: 'Users Info',
  sections: [
    {
      title: 'Overview',
      description:
        'The Users Info page displays all members registered in your current organization. You can see member roles, email verification status, and when they joined.',
      links: [
        {
          title: 'better-auth Organization Plugin',
          url: 'https://www.better-auth.com/docs/plugins/organization'
        }
      ]
    },
    {
      title: 'Member Roles',
      description:
        'Each member has a role within the organization: owner, admin, or member. Roles determine what actions a user can perform within the workspace.',
      links: []
    },
    {
      title: 'Summary',
      description:
        'The summary cards show the total number of members, your current role, and the active organization name.',
      links: []
    }
  ]
};
