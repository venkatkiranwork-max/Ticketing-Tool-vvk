import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

export function healthCheck(_req: Request, res: Response): Response {
  return sendSuccess(
    res,
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    'API is healthy',
  );
}
