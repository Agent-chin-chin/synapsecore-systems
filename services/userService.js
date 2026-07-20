const User = require('../lib/models/User');
const connectDB = require('../lib/mongoose');

/**
 * Get user by ID
 * @param {String} userId - User ID
 * @returns {Object|null} User object or null
 */
async function getUserById(userId) {
  await connectDB();
  return await User.findById(userId).select('-password');
}

/**
 * Get user by email
 * @param {String} email - User email
 * @returns {Object|null} User object or null
 */
async function getUserByEmail(email) {
  await connectDB();
  return await User.findOne({ email }).select('-password');
}

/**
 * Get all users with pagination
 * @param {Object} options - Pagination options
 * @param {Number} options.page - Page number (default: 1)
 * @param {Number} options.limit - Items per page (default: 10)
 * @param {string} [options.role] - Optional role filter
 * @param {string} [options.status] - Optional status filter
 * @returns {Object} Paginated users
 */
async function getUsers(options = {}) {
  await connectDB();
  
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (options.role) {
    filter.role = options.role;
  }

  if (options.status) {
    filter.status = options.status;
  }

  if (options.search) {
    const searchRegex = new RegExp(options.search, 'i');
    filter.$or = [
      { fullname: searchRegex },
      { email: searchRegex }
    ];
  }
  
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter)
  ]);
  
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Update user role
 * @param {String} userId - User ID
 * @param {String} role - New role
 * @returns {Object} Updated user
 */
async function updateUserRole(userId, role) {
  await connectDB();
  
  const user = await User.findByIdAndUpdate(
    userId,
    { role, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

async function updateUserStatus(userId, status) {
  await connectDB();

  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Delete user
 * @param {String} userId - User ID
 * @returns {Object} Deletion result
 */
async function deleteUser(userId) {
  await connectDB();
  
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return { message: 'User deleted successfully' };
}

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated user
 */
async function updateUserProfile(userId, updateData) {
  await connectDB();
  
  // Remove password from updateData if present (should be handled separately)
  const { password, ...safeUpdateData } = updateData;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { ...safeUpdateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserProfile
};