import { AuditLog, type AuditLogDocument } from '../models/AuditLog.model.js';

export const auditLogRepository = {
  create(data: {
    userId: string;
    action: 'create' | 'update' | 'delete' | 'read';
    entityType: 'user' | 'workspace' | 'project' | 'issue' | 'notification';
    entityId: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogDocument> {
    return AuditLog.create(data);
  },

  findByUserId(userId: string, limit = 100): Promise<AuditLogDocument[]> {
    return AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  findByEntityId(entityId: string, limit = 50): Promise<AuditLogDocument[]> {
    return AuditLog.find({ entityId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  findAll(limit = 500): Promise<AuditLogDocument[]> {
    return AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
};
