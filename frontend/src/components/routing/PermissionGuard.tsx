import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, hasScreenAccess, type PermissionKey } from '@/features/auth/permissions';
import type { ScreenKey } from '@/mock/users';
import { Forbidden403Page } from '@/pages/Forbidden403Page';
import { mockUsers } from '@/mock/users';

export interface PermissionGuardProps {
  permission?: PermissionKey;
  screen?: ScreenKey;
  requireSuperAdmin?: boolean;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, screen, requireSuperAdmin, children }: PermissionGuardProps) {
  const user = useAuthStore((s) => s.user) || mockUsers[0];

  if (user.status === 'Locked' || user.status === 'Inactive' || user.status === 'Suspended') {
    return <Forbidden403Page />;
  }

  if (requireSuperAdmin && user.role !== 'Super Admin' && user.role !== 'super_admin') {
    return <Forbidden403Page />;
  }

  if (screen && !hasScreenAccess(user as any, screen)) {
    return <Forbidden403Page />;
  }

  if (permission && !hasPermission(user as any, permission)) {
    return <Forbidden403Page />;
  }

  return <>{children}</>;
}
