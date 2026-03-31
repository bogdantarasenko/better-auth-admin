'use client';

import { AccountSettingsCards, SecuritySettingsCards } from '@daveyplate/better-auth-ui';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col gap-6 p-4'>
      <AccountSettingsCards />
      <SecuritySettingsCards />
    </div>
  );
}
