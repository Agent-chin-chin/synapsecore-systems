export interface AuditLogParams {
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
}

export function createAuditLog(params: AuditLogParams): Promise<any>;
export function getAuditLogs(options: { page?: number; limit?: number; actorId?: string; action?: string; targetType?: string; targetId?: string }): Promise<any>;