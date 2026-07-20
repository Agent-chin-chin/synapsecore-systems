const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  company: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
