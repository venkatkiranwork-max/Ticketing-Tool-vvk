import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../utils/AppError.js';
import type { UserRole } from '../types/index.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }

    next();
  };
}
