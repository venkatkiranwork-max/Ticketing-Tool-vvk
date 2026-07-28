import type { NextFunction, Request, Response } from 'express';
import { auditService } from '../services/audit.service.js';

export function auditLog(entityType: 'user' | 'workspace' | 'project' | 'issue' | 'notification') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const action = getActionFromMethod(req.method);
    const entityId = extractEntityId(req.params);

    if (action && entityId && req.user) {
      try {
        await auditService.logAction({
          userId: req.user.userId,
          action,
          entityType,
          entityId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
      } catch {
        // Silently fail audit logging to not block requests
      }
    }

    next();
  };
}

function getActionFromMethod(method: string): 'create' | 'update' | 'delete' | 'read' | null {
  switch (method) {
    case 'POST':
      return 'create';
    case 'PATCH':
    case 'PUT':
      return 'update';
    case 'DELETE':
      return 'delete';
    case 'GET':
      return 'read';
    default:
      return null;
  }
}

function extractEntityId(params: Record<string, unknown>): string | null {
  return (params.id as string) || (params.notificationId as string) || (params.workspaceId as string) || null;
}
