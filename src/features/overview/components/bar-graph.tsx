'use client';

import { Bar, BarChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { MonthlySignups } from '@/features/overview/api/types';

const chartConfig = {
  count: {
    label: 'Signups',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function BarGraph({ data }: { data: MonthlySignups[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Signups</CardTitle>
        <CardDescription>Monthly new user registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <rect x='0' y='0' width='100%' height='85%' fill='url(#bar-pattern-dots)' />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' hideLabel />}
            />
            <Bar dataKey='count' fill='var(--color-count)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = () => {
  return (
    <pattern id='bar-pattern-dots' x='0' y='0' width='10' height='10' patternUnits='userSpaceOnUse'>
      <circle className='dark:text-muted/40 text-muted' cx='2' cy='2' r='1' fill='currentColor' />
    </pattern>
  );
};
