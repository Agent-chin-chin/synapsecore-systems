const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let User = require('../lib/models/User');
User = User && User.default ? User.default : User;
const connectDB = require('../lib/mongoose');
const { sendNotificationEmail } = require('../lib/email');
const { sendSMS } = require('../lib/sms');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Register a new user
 * @param {Object} userData - User data (fullname, email, phone, password, role, status)
 * @returns {{ user: { id: string, fullname: string, email: string, role: string, status?: string }, token: string }} Created user object (without password) and token
 */
async function registerUser(userData) {
  await connectDB();
  
  const { fullname, email, phone, password, role, status, learnerProfile } = userData;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const verificationCode = role === 'learner' ? generateSixDigitCode() : null;
  const emailVerified = role !== 'learner';
  
  const user = new User({
    fullname,
    email,
    phone,
    password,
    role: role || 'client',
    status: status || (role === 'learner' ? 'pending' : 'approved'),
    emailVerified,
    verificationCode,
    learnerProfile: learnerProfile || {}
  });
  
  await user.save();
  
  const token = generateToken(user);
  
  const { password: _, ...userWithoutPassword } = user.toObject();
  
  return {
    user: {
      ...userWithoutPassword,
      id: userWithoutPassword._id.toString()
    },
    token,
    verificationCode
  };
}

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {{ user: { id: string, fullname: string, email: string, role: string, status?: string }, token: string }} User object (without password) and token
 */
async function loginUser(credentials) {
  await connectDB();
  
  const { email, password } = credentials;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const accountStatus = user.status || 'approved';

  if (user.role === 'learner' && accountStatus !== 'approved') {
    if (accountStatus === 'pending') {
      throw new Error('Learner account is pending approval');
    }
    if (accountStatus === 'rejected') {
      throw new Error('Learner application has been rejected');
    }
  }

  if (user.role === 'learner' && !user.emailVerified) {
    throw new Error('Email address not verified. Please verify your email before logging in.');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  
  // Generate token
  const token = generateToken(user);
  
  // Return user without password and token
  const { password: _, ...userWithoutPassword } = user.toObject();
  
  return {
    user: {
      ...userWithoutPassword,
      id: userWithoutPassword._id.toString()
    },
    token
  };
}

async function verifyUserEmail(email, code) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    return user;
  }

  if (!user.verificationCode || user.verificationCode !== code) {
    throw new Error('Invalid verification code');
  }

  user.emailVerified = true;
  user.verificationCode = null;
  user.updatedAt = new Date();
  await user.save();

  return user;
}

async function resendVerificationCode(email) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    throw new Error('Email already verified');
  }

  user.verificationCode = generateSixDigitCode();
  user.updatedAt = new Date();
  await user.save();

  return user;
}

async function requestPasswordReset(email) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  user.resetPasswordCode = generateSixDigitCode();
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
  user.updatedAt = new Date();
  await user.save();

  await sendNotificationEmail(
    { email: user.email, fullname: user.fullname },
    'Password reset request',
    `Your password reset code is ${user.resetPasswordCode}. It will expire in 1 hour.`
  );

  if (user.phone) {
    await sendSMS({
      to: user.phone,
      body: `Your password reset code is ${user.resetPasswordCode}. It expires in 1 hour.`,
    });
  }

  return user;
}

async function resetPassword(email, code, newPassword) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid reset token or email');
  }

  if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
    throw new Error('Invalid reset token or email');
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new Error('Reset token has expired');
  }

  user.password = newPassword;
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;
  user.updatedAt = new Date();
  await user.save();

  return user;
}

/**
 * Logout user (clears cookie on client side)
 * @returns {{ message: string }} Success message
 */
function logoutUser() {
  return {
    message: 'Logged out successfully'
  };
}

module.exports = {
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  verifyUserEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
  logoutUser
};
module.exports.default = module.exports;