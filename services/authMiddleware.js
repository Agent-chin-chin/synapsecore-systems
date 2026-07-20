const jwt = require('jsonwebtoken');
const User = require('../lib/models/User');
const connectDB = require('../lib/mongoose');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes using httpOnly cookies
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
async function authenticateToken(req, res, next) {
  try {
    await connectDB();
    
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
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
  authenticateToken,
  authorizeRole
};