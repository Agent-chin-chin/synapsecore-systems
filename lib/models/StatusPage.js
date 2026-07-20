const mongoose = require('mongoose');

const StatusPageSchema = new mongoose.Schema({
  status: { type: String, required: true }, // e.g. 'operational', 'degraded', 'outage'
  message: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.StatusPage || mongoose.model('StatusPage', StatusPageSchema);
