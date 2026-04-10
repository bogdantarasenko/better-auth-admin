'use client';

import { useCallback, useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { authClient } from '@/lib/auth-client';

type UserInfo = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export default function UsersInfoPage() {
  const { data: activeOrg, isPending: orgPending } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();
  const [members, setMembers] = useState<
    { id: string; role: string; user: UserInfo; createdAt: Date }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    try {
      const { data } = await authClient.organization.listMembers({
        query: { organizationId: activeOrg.id }
      });
      setMembers((data?.members as typeof members) || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [activeOrg?.id]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  return (
    <PageContainer
      isLoading={orgPending}
      access={!!activeOrg}
      accessFallback={
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>No Organization Selected</h2>
            <p className='text-muted-foreground'>
              Please select or create an organization to view user information.
            </p>
          </div>
        </div>
      }
      pageTitle='Users Info'
      pageDescription={`View registered users for ${activeOrg?.name}`}
    >
      <div className='space-y-6'>
        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Members</CardTitle>
              <Icons.teams className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{loading ? '...' : members.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Your Role</CardTitle>
              <Icons.user className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold capitalize'>
                {members.find((m) => m.user?.id === session?.user?.id)?.role || '...'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Organization</CardTitle>
              <Icons.workspace className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='truncate text-2xl font-bold'>{activeOrg?.name || '...'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
            <CardDescription>Users registered in {activeOrg?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <Icons.spinner className='h-6 w-6 animate-spin' />
              </div>
            ) : members.length === 0 ? (
              <p className='text-muted-foreground py-8 text-center'>No members found.</p>
            ) : (
              <div className='space-y-4'>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
                        {member.user?.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name}
                            className='h-10 w-10 rounded-full object-cover'
                          />
                        ) : (
                          <Icons.user className='h-5 w-5' />
                        )}
                      </div>
                      <div>
                        <p className='font-medium'>{member.user?.name}</p>
                        <p className='text-muted-foreground text-sm'>{member.user?.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge
                        variant={
                          member.role === 'owner'
                            ? 'default'
                            : member.role === 'admin'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {member.role}
                      </Badge>
                      <span className='text-muted-foreground text-xs'>
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
