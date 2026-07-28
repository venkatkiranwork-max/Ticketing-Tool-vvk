import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/features/auth/api';
import { useAuthStore } from '@/store/authStore';
import { QUERY_KEYS } from '@/constants';

export function AuthBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { isError } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const user = await fetchMe();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated && Boolean(accessToken),
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  return null;
}
