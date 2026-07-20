const mongoose = require('mongoose');
const Incident = require('../lib/models/Incident');
const connectDB = require('../lib/mongoose');
const { recordAudit } = require('./auditService');

async function getIncidents(filters = {}, user) {
  await connectDB();
  const {
    status,
    incidentType,
    priority,
    severity,
    search,
    assignedTo,
    assignedToName,
    page = 1,
    limit = 20
  } = filters;

  const filter = {};
  if (status) filter.status = status;
  if (incidentType) filter.incidentType = incidentType;
  if (priority) filter.priority = priority;
  if (severity) filter.severity = severity;
  if (assignedTo && mongoose.isValidObjectId(assignedTo)) {
    filter.assignedTo = assignedTo;
  }

  if (!user || !['Super Admin', 'Support Engineer'].includes(user.role)) {
    filter.userId = user?.id;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { description: searchRegex },
      { incidentType: searchRegex }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const query = Incident.find(filter)
    .populate('userId', 'fullname email')
    .populate('assignedTo', 'fullname')
    .sort({ createdAt: -1 });

  let incidents = await query.skip(skip).limit(Number(limit));
  let total = await Incident.countDocuments(filter);

  if (assignedToName) {
    const allMatches = await Incident.find(filter)
      .populate('userId', 'fullname email')
      .populate('assignedTo', 'fullname')
      .sort({ createdAt: -1 });

    const normalized = assignedToName.toLowerCase();
    const filtered = allMatches.filter((incident) =>
      incident.assignedTo?.fullname?.toLowerCase().includes(normalized)
    );

    total = filtered.length;
    incidents = filtered.slice(skip, skip + Number(limit));
  }

  return {
    incidents,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit) || 1)
    }
  };
}

function buildIncidentQueryByIdentifier(incidentId) {
  if (mongoose.isValidObjectId(incidentId)) {
    return Incident.findById(incidentId);
  }

  return Incident.findOne({ incidentCode: incidentId });
}

async function getIncidentById(incidentId, user) {
  await connectDB();
  const incident = await buildIncidentQueryByIdentifier(incidentId)
    .populate('userId', 'fullname email')
    .populate('assignedTo', 'fullname')
    .populate('statusHistory.changedBy', 'fullname')
    .populate('responseNotes.engineer', 'fullname email');

  if (!incident) {
    const error = new Error('Incident not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (user && !['Super Admin', 'Support Engineer'].includes(user.role)) {
    if (incident.userId._id.toString() !== user.id) {
      const error = new Error('Access denied');
      error.code = 'FORBIDDEN';
      throw error;
    }
  }

  return incident;
}

function generateIncidentCode() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `INC-${year}-${suffix}`;
}

async function createIncident(data, user) {
  await connectDB();
  const { userId, incidentType, description, priority, severity, attachments } = data;

  if (!incidentType || !description) {
    const error = new Error('Missing required fields: incidentType, description');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const incidentUserId = user && ['Super Admin', 'Support Engineer'].includes(user.role)
    ? userId || user.id
    : user?.id;

  if (!incidentUserId) {
    const error = new Error('User identity is required to create an incident');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const incident = new Incident({
    incidentCode: generateIncidentCode(),
    userId: incidentUserId,
    incidentType,
    description,
    priority: priority || 'medium',
    severity: severity || 'medium',
    status: 'open',
    statusHistory: [
      {
        status: 'open',
        timestamp: new Date(),
        notes: 'Incident opened'
      }
    ],
    attachments: attachments || []
  });

  await incident.save();
  await recordAudit({
    actorId: user.id,
    action: 'create-incident',
    targetType: 'Incident',
    targetId: incident._id,
    details: `Created incident: ${incidentType}`
  });

  return incident.populate('userId', 'fullname email');
}

async function updateIncidentStatus(incidentId, newStatus, engineerId, notes) {
  await connectDB();
  const incident = await buildIncidentQueryByIdentifier(incidentId);

  if (!incident) {
    const error = new Error('Incident not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const validStatuses = ['open', 'investigating', 'assigned', 'resolved', 'closed'];
  if (!validStatuses.includes(newStatus)) {
    const error = new Error(`Invalid status: ${newStatus}`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  incident.status = newStatus;
  incident.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    changedBy: engineerId,
    notes: notes || undefined
  });

  if (newStatus === 'resolved') {
    incident.resolvedAt = new Date();
  }

  await incident.save();
  await recordAudit({
    actorId: engineerId,
    action: 'update-status',
    targetType: 'Incident',
    targetId: incident._id,
    details: `Status changed to ${newStatus}`
  });

  return incident.populate('userId', 'fullname email').populate('assignedTo', 'fullname');
}

async function assignIncident(incidentId, engineerId) {
  await connectDB();
  const incident = await buildIncidentQueryByIdentifier(incidentId);

  if (!incident) {
    const error = new Error('Incident not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  incident.assignedTo = engineerId;
  incident.status = 'assigned';
  incident.statusHistory.push({
    status: 'assigned',
    timestamp: new Date(),
    changedBy: engineerId,
    notes: 'Assigned to engineer'
  });

  await incident.save();
  await recordAudit({
    actorId: engineerId,
    action: 'assign-incident',
    targetType: 'Incident',
    targetId: incident._id,
    details: `Assigned incident to engineer ${engineerId}`
  });

  return incident.populate('userId', 'fullname email').populate('assignedTo', 'fullname');
}

async function addResponseNote(incidentId, engineerId, note, isInternal = true) {
  await connectDB();
  const incident = await buildIncidentQueryByIdentifier(incidentId);

  if (!incident) {
    const error = new Error('Incident not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  incident.responseNotes.push({
    engineer: engineerId,
    note,
    isInternal,
    createdAt: new Date()
  });

  await incident.save();
  await recordAudit({
    actorId: engineerId,
    action: 'add-note',
    targetType: 'Incident',
    targetId: incident._id,
    details: `Added ${isInternal ? 'internal' : 'public'} note`
  });

  return incident.populate('responseNotes.engineer', 'fullname email');
}

module.exports = {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  assignIncident,
  addResponseNote
};
