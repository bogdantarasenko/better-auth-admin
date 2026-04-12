export type OverviewStats = {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  activeSessions: number;
  bannedUsers: number;
};

export type MonthlySignups = {
  month: string;
  count: number;
};

export type RoleDistribution = {
  role: string;
  count: number;
};

export type RecentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  createdAt: string;
};
