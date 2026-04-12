import { RecentSales } from '@/features/overview/components/recent-sales';
import { getRecentUsers } from '@/features/overview/api/service';

export default async function Sales() {
  const users = await getRecentUsers();
  return <RecentSales users={users} />;
}
