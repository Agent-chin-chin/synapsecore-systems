import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'incident_assigned',
      'incident_updated',
      'incident_resolved',
      'threat_detected',
      'system_alert',
      'maintenance_scheduled',
      'security_update',
      'user_action_required',
      'report_generated',
      'billing_alert'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['incidents', 'threats', 'system', 'billing', 'maintenance', 'security'],
    default: 'incidents'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  actionUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  isRead: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

notificationSchema.pre('save', function (next) {
  (this as any).updatedAt = new Date();
  next();
});

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification = (global as any).NotificationModel || mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
(global as any).NotificationModel = Notification;

export default Notification;
