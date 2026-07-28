const {
  getUserById,
  getUserByEmail,
  listUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserProfile,
} = require('../lib/supabase/modules/users');

module.exports = {
  getUserById,
  getUserByEmail,
  getUsers: listUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserProfile,
};