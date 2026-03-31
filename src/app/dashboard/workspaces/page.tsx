'use client';

import PageContainer from '@/components/layout/page-container';
import { OrganizationsCard } from '@daveyplate/better-auth-ui';
import { workspacesInfoContent } from '@/config/infoconfig';

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Manage your workspaces and switch between them'
      infoContent={workspacesInfoContent}
    >
      <OrganizationsCard />
    </PageContainer>
  );
}
