import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createUser, updateUser, deleteUser, banUser, unbanUser } from './service';
import { userKeys } from './queries';
import type { UserMutationPayload } from './types';

export const createUserMutation = mutationOptions({
  mutationFn: (data: UserMutationPayload) => createUser(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  }
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: Partial<UserMutationPayload> }) =>
    updateUser(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  }
});

export const deleteUserMutation = mutationOptions({
  mutationFn: (id: string) => deleteUser(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  }
});

export const banUserMutation = mutationOptions({
  mutationFn: ({ id, reason }: { id: string; reason?: string }) => banUser(id, reason),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  }
});

export const unbanUserMutation = mutationOptions({
  mutationFn: (id: string) => unbanUser(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  }
});
