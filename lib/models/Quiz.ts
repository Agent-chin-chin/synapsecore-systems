// lib/models/Quiz.ts
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: String,
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  scope: {
    type: String,
    enum: ['lesson', 'module', 'course'],
    default: 'module',
  },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 },
  // Optional linkage for reuse across courses
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
