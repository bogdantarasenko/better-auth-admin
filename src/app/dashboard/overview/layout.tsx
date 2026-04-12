import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import React from 'react';
import { getCurrentUser, getOverviewStats } from '@/features/overview/api/service';

function getGrowthBadge(current: number, previous: number) {
  if (previous === 0) {
    return current > 0
      ? { percent: '+100%', trending: 'up' as const }
      : { percent: '0%', trending: 'neutral' as const };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    percent: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    trending: change >= 0 ? ('up' as const) : ('down' as const)
  };
}

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const [currentUser, stats] = await Promise.all([getCurrentUser(), getOverviewStats()]);

  const userName = currentUser?.name?.split(' ')[0] ?? 'there';
  const growth = getGrowthBadge(stats.newUsersThisMonth, stats.newUsersLastMonth);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Hi, {userName}! Welcome back 👋</h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.totalUsers.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.teams />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>All registered users</div>
              <div className='text-muted-foreground'>Across all roles</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>New Users This Month</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.newUsersThisMonth.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {growth.trending === 'up' ? <Icons.trendingUp /> : <Icons.trendingDown />}
                  {growth.percent}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {growth.trending === 'up' ? 'Growing' : 'Declining'} vs last month{' '}
                {growth.trending === 'up' ? (
                  <Icons.trendingUp className='size-4' />
                ) : (
                  <Icons.trendingDown className='size-4' />
                )}
              </div>
              <div className='text-muted-foreground'>
                {stats.newUsersLastMonth.toLocaleString()} last month
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active Sessions</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.activeSessions.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.trendingUp />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>Currently active sessions</div>
              <div className='text-muted-foreground'>Users with valid sessions</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Banned Users</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.bannedUsers.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Icons.lock />
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>Accounts currently banned</div>
              <div className='text-muted-foreground'>Requires admin review</div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 min-h-0 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
