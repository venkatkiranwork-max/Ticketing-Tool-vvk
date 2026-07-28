import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { queryKeys } from '@/lib/queryKeys';
import type { MockUser } from '@/mock/users';

export function useUsersQuery() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: () => userService.getUsers(),
  });

  const inviteUserMutation = useMutation({
    mutationFn: (data: { email: string; role: string; team: string; project?: string }) => userService.inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const createUserDirectMutation = useMutation({
    mutationFn: (data: Partial<MockUser>) => userService.createUserDirect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const adminUpdateUserMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MockUser> & { password?: string } }) =>
      userService.adminUpdateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  return {
    ...usersQuery,
    inviteUser: inviteUserMutation.mutateAsync,
    createUserDirect: createUserDirectMutation.mutateAsync,
    toggleUserStatus: toggleUserStatusMutation.mutateAsync,
    adminUpdateUser: adminUpdateUserMutation.mutateAsync,
  };
}
