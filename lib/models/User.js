const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: function() {
      return this.role !== 'learner';
    },
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'learner', 'Super Admin', 'Support Engineer', 'Client/User'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'learner' ? 'pending' : 'approved';
    }
  },
  emailVerified: {
    type: Boolean,
    default: function() {
      return this.role !== 'learner';
    }
  },
  verificationCode: {
    type: String,
    default: null
  },
  resetPasswordCode: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
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

// Ensure id is set on save if not provided
userSchema.pre('save', async function () {
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
  this.updatedAt = new Date();

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = global.UserModel || mongoose.models.User || mongoose.model('User', userSchema);
global.UserModel = User;
module.exports = User;