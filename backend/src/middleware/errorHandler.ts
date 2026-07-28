import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return sendError(
      res,
      err.message,
      err.statusCode,
      err.errors,
      env.isDevelopment ? err.stack : undefined,
    );
  }

  console.error('Unhandled error:', err);

  return sendError(
    res,
    env.isProduction ? 'Internal server error' : err.message,
    500,
    undefined,
    env.isDevelopment ? err.stack : undefined,
  );
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
