const mongoose = require('mongoose');

const IncidentTimelineSchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  event: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.models.IncidentTimeline || mongoose.model('IncidentTimeline', IncidentTimelineSchema);
