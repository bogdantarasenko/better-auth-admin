'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ExclusivePage() {
  const { data: activeOrg, isPending } = authClient.useActiveOrganization();
  const [hasPro, setHasPro] = useState(false);
  const [checkingPlan, setCheckingPlan] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!activeOrg) {
        setHasPro(false);
        setCheckingPlan(false);
        return;
      }
      try {
        const { data } = await authClient.subscription.list({
          query: { referenceId: activeOrg.id }
        });
        const activeSub = (data || []).find(
          (s: { status: string; plan: string }) =>
            (s.status === 'active' || s.status === 'trialing') &&
            s.plan === 'pro'
        );
        setHasPro(!!activeSub);
      } catch {
        setHasPro(false);
      } finally {
        setCheckingPlan(false);
      }
    }
    void checkSubscription();
  }, [activeOrg?.id]);

  return (
    <PageContainer isLoading={isPending || checkingPlan}>
      {!hasPro ? (
        <div className='flex h-full items-center justify-center'>
          <Alert>
            <Icons.lock className='h-5 w-5 text-yellow-600' />
            <AlertDescription>
              <div className='mb-1 text-lg font-semibold'>Pro Plan Required</div>
              <div className='text-muted-foreground'>
                This page is only available to organizations on the{' '}
                <span className='font-semibold'>Pro</span> plan.
                <br />
                Upgrade your subscription in&nbsp;
                <Link className='underline' href='/dashboard/billing'>
                  Billing &amp; Plans
                </Link>
                .
              </div>
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className='space-y-6'>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-bold tracking-tight'>
              <Icons.badgeCheck className='h-7 w-7 text-green-600' />
              Exclusive Area
            </h1>
            <p className='text-muted-foreground'>
              Welcome, <span className='font-semibold'>{activeOrg?.name}</span>! This page
              contains exclusive features for Pro plan organizations.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Thank You for Checking Out the Exclusive Page</CardTitle>
              <CardDescription>
                This means you belong to an organization subscribed to the Pro plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-lg'>Have a wonderful day!</div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
