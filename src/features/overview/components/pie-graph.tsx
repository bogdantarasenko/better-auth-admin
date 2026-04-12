'use client';

import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { RoleDistribution } from '@/features/overview/api/types';

const ROLE_COLORS: Record<string, string> = {
  admin: 'var(--chart-1)',
  user: 'var(--chart-2)',
  owner: 'var(--chart-3)',
  member: 'var(--chart-4)'
};

function buildChartConfig(data: RoleDistribution[]): ChartConfig {
  const config: ChartConfig = {
    count: { label: 'Users' }
  };
  data.forEach((d, i) => {
    config[d.role] = {
      label: d.role.charAt(0).toUpperCase() + d.role.slice(1),
      color: ROLE_COLORS[d.role] ?? `var(--chart-${(i % 5) + 1})`
    };
  });
  return config;
}

export function PieGraph({ data }: { data: RoleDistribution[] }) {
  const chartConfig = buildChartConfig(data);
  const chartData = data.map((d) => ({
    role: d.role,
    count: d.count,
    fill: ROLE_COLORS[d.role] ?? `var(--chart-${(data.indexOf(d) % 5) + 1})`
  }));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Role Distribution</CardTitle>
        <CardDescription>{total} total users</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px] min-h-[250px]'
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey='count' hideLabel />} />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey='count'
              nameKey='role'
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey='role'
                stroke='none'
                fontSize={12}
                fontWeight={500}
                fill='currentColor'
                formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
