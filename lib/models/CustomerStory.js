const mongoose = require('mongoose');

const CustomerStorySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  story: { type: String, required: true },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.CustomerStory || mongoose.model('CustomerStory', CustomerStorySchema);
