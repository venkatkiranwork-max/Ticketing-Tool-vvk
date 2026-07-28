import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse, PaginationMeta, ValidationErrorItem } from '../types/index.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta,
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ValidationErrorItem[],
  stack?: string,
): Response {
  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(stack ? { stack } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = 'Success',
): Response {
  return sendSuccess(res, data, message, 200, meta);
}
