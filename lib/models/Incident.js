const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['open', 'investigating', 'assigned', 'resolved', 'closed'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { _id: false });

const responseNoteSchema = new mongoose.Schema({
  engineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    required: true
  },
  isInternal: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const incidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      'bug-fixing',
      'malware-removal',
      'website-recovery',
      'wordpress',
      'payment-gateway',
      'server-security',
      'database-repair',
      'emergency-support'
    ]
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'assigned', 'resolved', 'closed'],
    default: 'open'
  },
  statusHistory: [statusHistorySchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responseNotes: [responseNoteSchema],
  attachments: [{
    type: String
  }],
  incidentCode: {
    type: String,
    unique: true,
    index: true,
    default: function () {
      const year = new Date().getFullYear();
      const suffix = Math.floor(100000 + Math.random() * 900000);
      return `INC-${year}-${suffix}`;
    }
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
incidentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster querying - Optimized for platform stabilization
incidentSchema.index({ status: 1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ assignedTo: 1 });
incidentSchema.index({ userId: 1, status: 1 });
incidentSchema.index({ assignedTo: 1, status: 1 });

const Incident = global.IncidentModel || mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
global.IncidentModel = Incident;
module.exports = Incident;
