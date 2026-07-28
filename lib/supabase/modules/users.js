const { getSupabaseAdminClient, getSupabaseClient } = require('../client');

const client = getSupabaseAdminClient() || getSupabaseClient();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function mapSupabaseUser(user) {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};
  const role = metadata.role || appMetadata.role || 'client';

  return {
    id: user.id,
    _id: user.id,
    fullname: metadata.fullname || metadata.name || user.email || 'User',
    email: user.email || '',
    phone: metadata.phone || '',
    role,
    status: metadata.status || appMetadata.status || (role === 'learner' ? 'pending' : 'approved'),
    emailVerified: Boolean(user.email_confirmed_at || metadata.emailVerified),
    learnerProfile: metadata.learnerProfile || {},
    createdAt: user.created_at || null,
    updatedAt: user.confirmed_at || null,
    user_metadata: metadata,
    app_metadata: appMetadata,
  };
}

async function getUserById(userId) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.auth.admin.getUserById(userId);
  if (error) {
    throw error;
  }

  const user = data?.user || data;
  return mapSupabaseUser(user);
}

async function getUserByEmail(email) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    throw error;
  }

  const users = data?.users || [];
  const existing = users.find((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  return existing ? mapSupabaseUser(existing) : null;
}

async function listUsers(options = {}) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { page = 1, limit = 10, role, status, search } = options;
  const { data, error } = await client.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    throw error;
  }

  let users = (data?.users || []).map(mapSupabaseUser);

  if (role) {
    users = users.filter((user) => user.role === role);
  }
  if (status) {
    users = users.filter((user) => user.status === status);
  }
  if (search) {
    const query = String(search).trim().toLowerCase();
    users = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone || '').toLowerCase().includes(query)
    );
  }

  const total = users.length;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);

  return {
    users: paginated,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

async function updateUserRole(userId, role) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const existing = await client.auth.admin.getUserById(userId);
  if (existing.error) {
    throw existing.error;
  }

  const record = existing.data?.user || existing.data;
  if (!record) {
    throw new Error('User not found');
  }

  const { data, error } = await client.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...(record.user_metadata || {}),
      role,
    },
    app_metadata: {
      ...(record.app_metadata || {}),
      role,
    },
  });

  if (error) {
    throw error;
  }

  return mapSupabaseUser(data?.user || data);
}

async function updateUserStatus(userId, status) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const existing = await client.auth.admin.getUserById(userId);
  if (existing.error) {
    throw existing.error;
  }

  const record = existing.data?.user || existing.data;
  if (!record) {
    throw new Error('User not found');
  }

  const { data, error } = await client.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...(record.user_metadata || {}),
      status,
    },
    app_metadata: {
      ...(record.app_metadata || {}),
      status,
    },
  });

  if (error) {
    throw error;
  }

  return mapSupabaseUser(data?.user || data);
}

async function deleteUser(userId) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await client.auth.admin.deleteUser(userId);
  if (error) {
    throw error;
  }

  return { message: 'User deleted successfully' };
}

async function updateUserProfile(userId, updateData) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const existing = await client.auth.admin.getUserById(userId);
  if (existing.error) {
    throw existing.error;
  }

  const record = existing.data?.user || existing.data;
  if (!record) {
    throw new Error('User not found');
  }

  const { data, error } = await client.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...(record.user_metadata || {}),
      ...updateData,
    },
  });

  if (error) {
    throw error;
  }

  return mapSupabaseUser(data?.user || data);
}

module.exports = {
  getUserById,
  getUserByEmail,
  listUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserProfile,
};

module.exports.default = module.exports;
