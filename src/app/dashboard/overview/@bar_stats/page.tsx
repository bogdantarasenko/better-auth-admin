import { BarGraph } from '@/features/overview/components/bar-graph';
import { getMonthlySignups } from '@/features/overview/api/service';

export default async function BarStats() {
  const data = await getMonthlySignups();
  return <BarGraph data={data} />;
}
