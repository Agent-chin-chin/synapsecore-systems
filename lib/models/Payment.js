const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit-card', 'paypal', 'bank-transfer', 'stripe', 'paystack']
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  description: {
    type: String
  },
  paymentReference: {
    type: String,
    index: true
  },
  paymentGateway: {
    type: String,
    enum: ['paystack', 'manual'],
    default: 'paystack'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = global.PaymentModel || mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
global.PaymentModel = Payment;
module.exports = Payment;