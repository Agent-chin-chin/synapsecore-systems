const AuditLog = require('../lib/models/AuditLog');
const connectDB = require('../lib/mongoose');

async function createAuditLog({ actorId, action, targetType, targetId, details }) {
  await connectDB();
  const log = new AuditLog({ actorId, action, targetType, targetId, details });
  await log.save();
  return log.toObject();
}

async function getAuditLogs({ page = 1, limit = 20, actorId, action, targetType, targetId }) {
  await connectDB();
  const filter = {};
  if (actorId) filter.actorId = actorId;
  if (action) filter.action = action;
  if (targetType) filter.targetType = targetType;
  if (targetId) filter.targetId = targetId;
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actorId', 'fullname email')
      .lean(),
    AuditLog.countDocuments(filter)
  ]);
  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

module.exports = { createAuditLog, getAuditLogs };
