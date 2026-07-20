const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = global.AuditLogModel || mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
global.AuditLogModel = AuditLog;
module.exports = AuditLog;