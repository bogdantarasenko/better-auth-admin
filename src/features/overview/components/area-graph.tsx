'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

export function AreaGraph({ data }: { data: MonthlySignups[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup Trend</CardTitle>
        <CardDescription>User registrations over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <Area
              dataKey='count'
              type='natural'
              fill='url(#area-dotted-pattern)'
              fillOpacity={0.4}
              stroke='var(--color-count)'
              strokeWidth={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id='area-dotted-pattern'
      x='0'
      y='0'
      width='7'
      height='7'
      patternUnits='userSpaceOnUse'
    >
      <circle cx='5' cy='5' r='1.5' fill='var(--color-count)' opacity={0.5} />
    </pattern>
  );
};
