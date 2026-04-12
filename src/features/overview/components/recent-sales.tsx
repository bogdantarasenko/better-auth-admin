import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import type { RecentUser } from '@/features/overview/api/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function RecentSales({ users }: { users: RecentUser[] }) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>{users.length} most recently registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {users.map((u) => (
            <div key={u.id} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                {u.image && <AvatarImage src={u.image} alt={u.name} />}
                <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{u.name}</p>
                <p className='text-muted-foreground text-sm'>{u.email}</p>
              </div>
              <div className='text-muted-foreground ml-auto text-sm'>{timeAgo(u.createdAt)}</div>
            </div>
          ))}
          {users.length === 0 && <p className='text-muted-foreground text-sm'>No users yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
