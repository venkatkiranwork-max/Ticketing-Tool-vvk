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

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  workspaceId?: string;
};

export type UserRole =
  | 'Super Admin'
  | 'Project Manager'
  | 'Team Lead'
  | 'Member'
  | 'Viewer'
  | 'Guest'
  | 'super_admin'
  | 'member'
  | 'viewer';

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}
