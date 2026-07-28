import type { UserDocument } from '../models/User.model.js';
import type { UserRole } from '../types/index.js';

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
};

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as UserRole,
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
  };
}
