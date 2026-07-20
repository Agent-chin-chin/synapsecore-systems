const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'slack', 'webhook', 'email', etc.
  config: { type: Object },
  enabled: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Integration || mongoose.model('Integration', IntegrationSchema);
