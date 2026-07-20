// lib/models/Enrollment.ts
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended'],
    default: 'active'
  },
  
  progress: {
    completedLessons: { type: Number, default: 0 },
    totalLessons: Number,
    progressPercentage: { type: Number, default: 0 },
    lastAccessedAt: Date
  },
  lessonProgress: [
    {
      moduleIndex: Number,
      lessonIndex: Number,
      completed: { type: Boolean, default: false },
      completedAt: Date
    }
  ],
  
  assessments: [
    {
      quizId: mongoose.Schema.Types.ObjectId,
      score: Number,
      passed: Boolean,
      completedAt: Date
    }
  ],
  
  certificate: {
    earned: { type: Boolean, default: false },
    certificateUrl: String,
    earnedAt: Date,
    score: Number
  },
  
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date
});

enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
