const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  type: { type: String }, // e.g. 'guide', 'video', 'tool', etc.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
