const mongoose = require('mongoose');
const crypto = require('crypto');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  label: { type: String },
  scopes: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

ApiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema);
