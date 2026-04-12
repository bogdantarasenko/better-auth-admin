'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { UserFilters, UsersResponse, UserMutationPayload } from './types';

export async function getUsers(filters: UserFilters): Promise<UsersResponse> {
  const limit = filters.limit ?? 10;
  const offset = ((filters.page ?? 1) - 1) * limit;

  const result = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit,
      offset,
      ...(filters.search
        ? {
            searchValue: filters.search,
            searchField: 'name' as const,
            searchOperator: 'contains' as const
          }
        : {}),
      ...(filters.sort
        ? {
            sortBy: filters.sort.replace(/^-/, '') as 'name' | 'email' | 'createdAt',
            sortDirection: (filters.sort.startsWith('-') ? 'desc' : 'asc') as 'asc' | 'desc'
          }
        : {
            sortBy: 'createdAt' as const,
            sortDirection: 'desc' as const
          }),
      ...(filters.roles
        ? {
            filterField: 'role' as const,
            filterValue: filters.roles,
            filterOperator: 'eq' as const
          }
        : {})
    }
  });

  return {
    users: result.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      banned: u.banned,
      banReason: u.banReason,
      banExpires: u.banExpires ? String(u.banExpires) : null,
      createdAt: String(u.createdAt)
    })),
    total: result.total,
    limit,
    offset
  };
}

export async function createUser(data: UserMutationPayload) {
  return auth.api.createUser({
    headers: await headers(),
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as 'user' | 'admin'
    }
  });
}

export async function updateUser(id: string, data: Partial<UserMutationPayload>) {
  if (data.role) {
    await auth.api.setRole({
      headers: await headers(),
      body: { userId: id, role: data.role as 'user' | 'admin' }
    });
  }
  return { success: true };
}

export async function deleteUser(id: string) {
  return auth.api.removeUser({
    headers: await headers(),
    body: { userId: id }
  });
}

export async function banUser(id: string, reason?: string) {
  return auth.api.banUser({
    headers: await headers(),
    body: { userId: id, banReason: reason }
  });
}

export async function unbanUser(id: string) {
  return auth.api.unbanUser({
    headers: await headers(),
    body: { userId: id }
  });
}
