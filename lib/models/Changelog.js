const mongoose = require('mongoose');

const ChangelogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  releasedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.models.Changelog || mongoose.model('Changelog', ChangelogSchema);
