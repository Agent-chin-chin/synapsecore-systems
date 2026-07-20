const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const connectDB = require('./mongoose');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

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

/**
 * Register a new user
 * @param {Object} userData - User data (fullname, email, phone, password, role)
 * @returns {{ user: Object, token: string }} Created user object (without password) and token
 */
async function registerUser(userData) {
  await connectDB();
  
  const { fullname, email, phone, password, role } = userData;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create user - password will be hashed by User model pre-save hook
  const user = new User({
    fullname,
    email,
    phone,
    password,
    role: role || 'client'
  });
  
  await user.save();
  
  // Generate token
  const token = generateToken(user);
  
  // Return user without password and token
  const { password: _, ...userWithoutPassword } = user.toObject();
  
  return {
    user: userWithoutPassword,
    token
  };
}

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {{ user: Object, token: string }} User object (without password) and token
 */
async function loginUser(credentials) {
  await connectDB();
  
  const { email, password } = credentials;
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
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
    user: userWithoutPassword,
    token
  };
}

/**
 * Middleware to protect routes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to check role
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  authenticateToken,
  authorizeRole
};