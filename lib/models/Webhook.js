const mongoose = require('mongoose');

const WebhookSchema = new mongoose.Schema({
  url: { type: String, required: true },
  event: { type: String, required: true },
  secret: { type: String },
  enabled: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Webhook || mongoose.model('Webhook', WebhookSchema);
