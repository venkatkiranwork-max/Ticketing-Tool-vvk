import { Request, Response, NextFunction } from 'express';
import { hasPermission, type PermissionKey } from '../permissions/permissions.js';
import { createErrorResponse } from '../dto/response.dto.js';

export function authorizePermission(permission: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as Request & { user?: { role?: string } }).user?.role || 'Guest';

    if (!hasPermission(userRole, permission)) {
      res.status(403).json(createErrorResponse(`403 Forbidden: Lacks required permission '${permission}'`));
      return;
    }

    next();
  };
}
