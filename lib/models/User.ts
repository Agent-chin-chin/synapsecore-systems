// lib/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['client', 'admin', 'learner'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: function(this: any) {
      return this.role === 'learner' ? 'pending' : 'approved';
    }
  },
  // Learner-specific fields
  learnerProfile: {
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    learningGoals: String,
    bio: String,
    location: String,
    profilePicture: String,
    dateOfBirth: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    },
    nationality: String,
    countryOfCitizenship: String,
    stateOfOrigin: String,
    identificationType: {
      type: String,
      enum: ['passport', 'drivers_license', 'national_id', 'voters_card', 'other'],
      default: 'national_id'
    },
    identificationNumber: String,
    idDocumentFront: String,
    idDocumentBack: String,
    idIssueDate: String,
    idExpiryDate: String,
    idIssuePlace: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    timeZone: String,
    preferredLanguage: String,
    guardianName: String,
    guardianPhone: String,
    guardianEmail: String,
    guardianAddress: String,
    guardianRelationship: String,
    emergencyContactName: String,
    emergencyContactPhone: String,
    emergencyContactEmail: String,
    emergencyContactRelationship: String,
    secondaryEmergencyContactName: String,
    secondaryEmergencyContactPhone: String,
    secondaryEmergencyContactRelationship: String,
    educationLevel: String,
    employmentStatus: String,
    fieldOfStudy: String,
    institutionName: String,
    yearsOfExperience: String,
    previousCertifications: String,
    hearAboutUs: String,
    referralCode: String,
    selectedCourse: String,
    paymentPlanPreference: String,
    primaryDevice: String,
    operatingSystem: String,
    internetConnectivity: String,
    preferredLearningSchedule: String,
    backgroundCheckConsent: { type: Boolean, default: false },
    guardianConsent: { type: Boolean, default: false },
    dataProcessingConsent: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    enrolledCourses: [
      {
        courseId: mongoose.Schema.Types.ObjectId,
        enrolledAt: Date,
        status: { type: String, enum: ['enrolled', 'completed', 'dropped'] },
        progress: { type: Number, default: 0 },
        completedAt: Date
      }
    ],
    completedCourses: [mongoose.Schema.Types.ObjectId],
    certifications: [
      {
        courseId: mongoose.Schema.Types.ObjectId,
        certificateUrl: String,
        earnedAt: Date,
        score: Number
      }
    ],
    totalHoursLearned: { type: Number, default: 0 },
    learningStreak: { type: Number, default: 0 },
    lastActiveAt: Date
  },
  // Client-specific fields
  companyName: String,
  phone: String,
  address: String,
  subscriptionPlan: String,
  settings: {
    emailNotifications: { type: Boolean, default: true },
    courseReminders: { type: Boolean, default: true },
    assessmentAlerts: { type: Boolean, default: true },
    communityDigest: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = (global as any).UserModel || mongoose.models.User || mongoose.model('User', userSchema);
(global as any).UserModel = User;
export default User;
