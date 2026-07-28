import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/AppError.js';

export function validateRequest(req: Request, _res: Response, next: NextFunction): void {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: 'path' in e ? String(e.path) : 'unknown',
      message: e.msg as string,
    }));
    throw new BadRequestError('Validation failed', errors);
  }
  next();
}
