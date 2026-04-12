import { PieGraph } from '@/features/overview/components/pie-graph';
import { getRoleDistribution } from '@/features/overview/api/service';

export default async function Stats() {
  const data = await getRoleDistribution();
  return <PieGraph data={data} />;
}
