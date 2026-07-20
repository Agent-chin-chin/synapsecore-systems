const Role = require('../lib/models/Role');

async function getRoles() {
  return await Role.find().sort({ name: 1 });
}

async function getRoleById(roleId) {
  return await Role.findById(roleId);
}

async function createRole({ name, permissions }) {
  const role = new Role({ name, permissions });
  await role.save();
  return role;
}

async function updateRole(roleId, updateData) {
  const role = await Role.findByIdAndUpdate(roleId, updateData, {
    new: true,
    runValidators: true
  });
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
}

async function deleteRole(roleId) {
  const role = await Role.findByIdAndDelete(roleId);
  if (!role) {
    throw new Error('Role not found');
  }
  return role;
}

module.exports = { getRoles, getRoleById, createRole, updateRole, deleteRole };
