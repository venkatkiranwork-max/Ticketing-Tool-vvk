export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ValidationErrorItem[];
  stack?: string;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ValidationErrorItem = {
  field: string;
  message: string;
};

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Project Manager'
  | 'Team Lead'
  | 'Member'
  | 'Viewer'
  | 'Guest'
  | 'super_admin'
  | 'admin'
  | 'member'
  | 'viewer';

export type User = {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId?: string;
  role: UserRole;
  team?: string;
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Locked';
  department?: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate?: string | Date;
  lastLogin?: string;
  createdDate?: string;
  screens?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
};
