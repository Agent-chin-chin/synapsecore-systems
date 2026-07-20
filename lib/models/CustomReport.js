const mongoose = require('mongoose');

const CustomReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filters: { type: Object },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.CustomReport || mongoose.model('CustomReport', CustomReportSchema);
