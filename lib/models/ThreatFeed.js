const mongoose = require('mongoose');

const ThreatFeedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String },
  publishedAt: { type: Date, default: Date.now },
  source: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.ThreatFeed || mongoose.model('ThreatFeed', ThreatFeedSchema);
