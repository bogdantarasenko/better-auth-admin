'use client';
import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { authClient } from '@/lib/auth-client';
import { ActiveThemeProvider } from '../themes/active-theme';
import QueryProvider from './query-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthUIProvider
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          onSessionChange={() => {
            router.refresh();
          }}
          redirectTo='/dashboard/overview'
          Link={Link}
        >
          <QueryProvider>{children}</QueryProvider>
        </AuthUIProvider>
      </ActiveThemeProvider>
    </>
  );
}
