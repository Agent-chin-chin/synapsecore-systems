import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general' }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);