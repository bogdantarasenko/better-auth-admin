'use client';

import PageContainer from '@/components/layout/page-container';
import { OrganizationSettingsCards } from '@daveyplate/better-auth-ui';
import { teamInfoContent } from '@/config/infoconfig';

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage your workspace team, members, roles, security and more.'
      infoContent={teamInfoContent}
    >
      <OrganizationSettingsCards />
    </PageContainer>
  );
}
