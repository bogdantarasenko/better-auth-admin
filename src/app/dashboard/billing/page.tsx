'use client';

import { useCallback, useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { authClient } from '@/lib/auth-client';
import { billingInfoContent } from '@/config/infoconfig';

type Subscription = {
  id: string;
  plan: string;
  status: string;
  periodStart?: Date;
  periodEnd?: Date;
  seats?: number;
};

const plans = [
  {
    name: 'free',
    label: 'Free',
    description: 'For small teams getting started',
    features: ['Up to 3 projects', 'Up to 5 members', 'Community support'],
    price: '$0',
    period: '/month'
  },
  {
    name: 'pro',
    label: 'Pro',
    description: 'For growing teams that need more',
    features: [
      'Up to 100 projects',
      'Up to 50 members',
      'Priority support',
      'Exclusive features'
    ],
    price: '$19',
    period: '/month',
    popular: true
  }
];

export default function BillingPage() {
  const { data: activeOrg, isPending: orgPending } =
    authClient.useActiveOrganization();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    try {
      const { data } = await authClient.subscription.list({
        query: {
          referenceId: activeOrg.id
        }
      });
      setSubscriptions((data as Subscription[]) || []);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    void fetchSubscriptions();
  }, [fetchSubscriptions]);

  const activeSub = subscriptions.find(
    (s) => s.status === 'active' || s.status === 'trialing'
  );
  const currentPlan = activeSub?.plan || 'free';

  const handleUpgrade = async (planName: string) => {
    if (!activeOrg) return;
    setActionLoading(planName);
    try {
      await authClient.subscription.upgrade({
        plan: planName,
        successUrl: `${window.location.origin}/dashboard/billing`,
        cancelUrl: `${window.location.origin}/dashboard/billing`,
        referenceId: activeOrg.id
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!activeSub) return;
    setActionLoading('cancel');
    try {
      await authClient.subscription.cancel({
        subscriptionId: activeSub.id,
        returnUrl: `${window.location.origin}/dashboard/billing`
      });
      await fetchSubscriptions();
    } finally {
      setActionLoading(null);
    }
  };

  const handlePortal = async () => {
    setActionLoading('portal');
    try {
      await authClient.subscription.billingPortal({
        returnUrl: `${window.location.origin}/dashboard/billing`
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageContainer
      isLoading={orgPending}
      access={!!activeOrg}
      accessFallback={
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>No Organization Selected</h2>
            <p className='text-muted-foreground'>
              Please select or create an organization to view billing
              information.
            </p>
          </div>
        </div>
      }
      infoContent={billingInfoContent}
      pageTitle='Billing & Plans'
      pageDescription={`Manage your subscription and usage limits for ${activeOrg?.name}`}
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Plans and subscriptions are managed through Stripe. Subscribe to a
            plan to unlock features and higher limits.
          </AlertDescription>
        </Alert>

        {/* Current Subscription Status */}
        {activeSub && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                Current Subscription
                <Badge
                  variant={
                    activeSub.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {activeSub.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                You are on the{' '}
                <span className='font-semibold capitalize'>
                  {activeSub.plan}
                </span>{' '}
                plan
                {activeSub.periodEnd &&
                  ` · Renews ${new Date(activeSub.periodEnd).toLocaleDateString()}`}
              </CardDescription>
            </CardHeader>
            <CardFooter className='gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePortal}
                disabled={actionLoading === 'portal'}
              >
                {actionLoading === 'portal' && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                Manage Billing
              </Button>
              {currentPlan !== 'free' && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCancel}
                  disabled={actionLoading === 'cancel'}
                >
                  {actionLoading === 'cancel' && (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Cancel Subscription
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Choose a plan that fits your organization&apos;s needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mx-auto grid max-w-4xl gap-6 md:grid-cols-2'>
              {plans.map((plan) => {
                const isCurrent = currentPlan === plan.name;
                return (
                  <Card
                    key={plan.name}
                    className={
                      plan.popular ? 'border-primary shadow-md' : undefined
                    }
                  >
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-xl'>{plan.label}</CardTitle>
                        {plan.popular && <Badge>Popular</Badge>}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='mb-4'>
                        <span className='text-3xl font-bold'>{plan.price}</span>
                        <span className='text-muted-foreground'>
                          {plan.period}
                        </span>
                      </div>
                      <ul className='space-y-2'>
                        {plan.features.map((feature) => (
                          <li key={feature} className='flex items-center gap-2'>
                            <Icons.check className='text-primary h-4 w-4' />
                            <span className='text-sm'>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {isCurrent ? (
                        <Button className='w-full' disabled variant='outline'>
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className='w-full'
                          variant={plan.popular ? 'default' : 'outline'}
                          disabled={
                            loading || actionLoading === plan.name
                          }
                          onClick={() => handleUpgrade(plan.name)}
                        >
                          {actionLoading === plan.name && (
                            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                          )}
                          {plan.name === 'free'
                            ? 'Downgrade'
                            : 'Upgrade to Pro'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
