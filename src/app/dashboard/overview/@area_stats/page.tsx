import { AreaGraph } from '@/features/overview/components/area-graph';
import { getMonthlySignups } from '@/features/overview/api/service';

export default async function AreaStats() {
  const data = await getMonthlySignups();
  return <AreaGraph data={data} />;
}
