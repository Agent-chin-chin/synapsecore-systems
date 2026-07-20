const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster querying by date
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket = global.SupportTicketModel || mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);
global.SupportTicketModel = SupportTicket;
module.exports = SupportTicket;
