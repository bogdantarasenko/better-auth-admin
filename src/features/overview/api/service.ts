'use server';

import { db } from '@/lib/db';
import { user, session } from '@/lib/auth-schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { and, count, gte, lt, eq, sql, desc } from 'drizzle-orm';
import type { OverviewStats, MonthlySignups, RoleDistribution, RecentUser } from './types';

export async function getOverviewStats(): Promise<OverviewStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [totalResult, newThisMonthResult, newLastMonthResult, activeSessionsResult, bannedResult] =
    await Promise.all([
      db.select({ count: count() }).from(user),
      db.select({ count: count() }).from(user).where(gte(user.createdAt, startOfMonth)),
      db
        .select({ count: count() })
        .from(user)
        .where(and(gte(user.createdAt, startOfLastMonth), lt(user.createdAt, startOfMonth))),
      db.select({ count: count() }).from(session).where(gte(session.expiresAt, now)),
      db.select({ count: count() }).from(user).where(eq(user.banned, true))
    ]);

  return {
    totalUsers: totalResult[0]?.count ?? 0,
    newUsersThisMonth: newThisMonthResult[0]?.count ?? 0,
    newUsersLastMonth: newLastMonthResult[0]?.count ?? 0,
    activeSessions: activeSessionsResult[0]?.count ?? 0,
    bannedUsers: bannedResult[0]?.count ?? 0
  };
}

export async function getMonthlySignups(): Promise<MonthlySignups[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const results = await db
    .select({
      month: sql<string>`to_char(${user.createdAt}, 'YYYY-MM')`,
      count: count()
    })
    .from(user)
    .where(gte(user.createdAt, sixMonthsAgo))
    .groupBy(sql`to_char(${user.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${user.createdAt}, 'YYYY-MM')`);

  // Fill in missing months with 0
  const months: MonthlySignups[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'long' });
    const found = results.find((r) => r.month === key);
    months.push({ month: label, count: found?.count ?? 0 });
  }

  return months;
}

export async function getRoleDistribution(): Promise<RoleDistribution[]> {
  const results = await db
    .select({
      role: sql<string>`COALESCE(${user.role}, 'user')`,
      count: count()
    })
    .from(user)
    .groupBy(sql`COALESCE(${user.role}, 'user')`);

  return results.map((r) => ({
    role: r.role,
    count: r.count
  }));
}

export async function getRecentUsers(): Promise<RecentUser[]> {
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(5);

  return results.map((u) => ({
    ...u,
    createdAt: String(u.createdAt)
  }));
}

export async function getCurrentUser() {
  const currentSession = await auth.api.getSession({
    headers: await headers()
  });
  return currentSession?.user ?? null;
}
