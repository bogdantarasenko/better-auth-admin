export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | null;
  createdAt: string;
};

export type UserFilters = {
  page?: number;
  limit?: number;
  roles?: string;
  search?: string;
  sort?: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  limit: number;
  offset: number;
};

export type UserMutationPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
};
