import { auditLogRepository } from '../repositories/audit.repository.js';

export const auditService = {
  async logAction(input: {
    userId: string;
    action: 'create' | 'update' | 'delete' | 'read';
    entityType: 'user' | 'workspace' | 'project' | 'issue' | 'notification';
    entityId: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return auditLogRepository.create(input);
  },

  async getUserAuditLogs(userId: string) {
    return auditLogRepository.findByUserId(userId);
  },

  async getEntityAuditLogs(entityId: string) {
    return auditLogRepository.findByEntityId(entityId);
  },

  async getAllAuditLogs() {
    return auditLogRepository.findAll();
  },
};
