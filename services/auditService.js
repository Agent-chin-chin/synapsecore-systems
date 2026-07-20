const AuditLog = require('../lib/models/AuditLog');

async function recordAudit({ actorId, action, targetType, targetId, details = '' }) {
  const auditEntry = new AuditLog({ actorId, action, targetType, targetId, details });
  return auditEntry.save();
}

module.exports = {
  recordAudit
};