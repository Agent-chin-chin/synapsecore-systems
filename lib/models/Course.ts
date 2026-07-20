// lib/models/Course.ts
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['recorded', 'live', 'zoom'],
    default: 'recorded',
  },
  title: String,
  scheduledAt: Date,
  duration: Number, // in minutes
}, { _id: true });

const downloadSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  fileType: {
    type: String,
    enum: ['pdf', 'zip', 'source', 'slides', 'other'],
    default: 'other',
  },
}, { _id: true });

const subtitleSchema = new mongoose.Schema({
  lang: { type: String, default: 'en' },
  label: String,
  url: String,
}, { _id: true });

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueInDays: Number,
  points: { type: Number, default: 100 },
}, { _id: true });

const quizRefSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  notes: String, // markdown
  videos: [videoSchema],
  duration: Number, // in minutes (derived/primary)
  order: Number,
  downloads: [downloadSchema],
  quiz: quizRefSchema,
  assignment: assignmentSchema,
  discussionEnabled: { type: Boolean, default: false },
  subtitles: [subtitleSchema],
  playground: {
    enabled: { type: Boolean, default: false },
    kind: { type: String, default: '' },
  },
  aiTutor: {
    enabled: { type: Boolean, default: false },
  },
  completed: { type: Boolean, default: false },
}, { _id: true });

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  notes: String,
  order: Number,
  lessons: [lessonSchema],
  quiz: quizRefSchema,
  assignment: assignmentSchema,
  unlockRule: {
    type: String,
    enum: ['immediate', 'videoComplete', 'quizPass', 'assignmentSubmit'],
    default: 'videoComplete',
  },
}, { _id: true });

const certificateSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  template: String,
  requireQuizAvg: { type: Number, default: 70 },
  requireFinalProject: { type: Boolean, default: false },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  notes: {
    explanation: String,
    practical: String,
    summary: String,
  },
  category: {
    type: String,
    enum: ['Security', 'Hacking', 'Networks', 'Compliance', 'Forensics', 'Administration', 'AI Automation', 'Web Development', 'Cloud Security'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  price: {
    type: Number,
    default: 0 // in Naira
  },
  duration: String, // e.g., "6 weeks"
  thumbnail: String,

  modules: [moduleSchema],

  // Reusable quizzes are stored in the Quiz collection and referenced.
  // Course-level quizzes kept for backward compatibility / standalone assessments.
  quizzes: [{
    title: String,
    description: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: { type: Number, default: 70 }
  }],

  certificate: certificateSchema,

  instructor: {
    name: String,
    bio: String,
    avatar: String
  },
  instructors: [{
    name: String,
    bio: String,
    avatar: String
  }],
  rating: { type: Number, default: 0 },
  enrollmentCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },

  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
