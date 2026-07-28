const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../lib/config');
const { getSupabaseClient, getSupabaseAdminClient, isSupabaseConfigured } = require('../lib/supabase');
const { sendNotificationEmail } = require('../lib/email');
const { sendSMS } = require('../lib/sms');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeVerificationCode(code) {
  return String(code || '').replace(/\D/g, '').trim();
}

function mapSupabaseUser(user) {
  const metadata = user?.user_metadata || {};
  const appMetadata = user?.app_metadata || {};
  const role = metadata.role || appMetadata.role || 'client';
  return {
    id: user?.id || user?.user?.id,
    _id: user?.id || user?.user?.id,
    fullname: metadata.fullname || metadata.name || 'User',
    email: user?.email || '',
    phone: metadata.phone || '',
    role,
    status: metadata.status || appMetadata.status || 'approved',
    emailVerified: Boolean(user?.email_confirmed_at || metadata.emailVerified),
    learnerProfile: metadata.learnerProfile || {},
  };
}

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }
}

function getSupabaseClientOrThrow() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase is not configured');
  }
  return client;
}

function getSupabaseAdminClientOrThrow() {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error('Supabase is not configured');
  }
  return client;
}

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

function isSupabaseRateLimitError(error) {
  const code = error?.code || '';
  const status = error?.status;
  const message = String(error?.message || '').toLowerCase();

  return code === 'over_email_send_rate_limit' || status === 429 || message.includes('rate limit') || message.includes('email rate limit');
}

function getSupabaseAdminBaseUrl() {
  const supabaseUrl = config.SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }

  return supabaseUrl.replace(/\/$/, '') + '/auth/v1';
}

async function createUserWithAdminApi(userData) {
  const { fullname, email, phone, password, role, status, learnerProfile } = userData;
  const normalizedEmail = normalizeEmail(email);
  const supabaseUrl = getSupabaseAdminBaseUrl();
  const serviceRoleKey = config.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        fullname,
        phone: phone || '',
        role,
        status,
        learnerProfile: learnerProfile || {},
        verificationCode: userData.verificationCode || null,
        emailVerified: userData.emailVerified || false,
      },
      app_metadata: {
        role,
        status,
        emailVerified: userData.emailVerified || false,
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || 'Unable to create Supabase user');
    error.status = response.status;
    error.code = payload?.code;
    throw error;
  }

  return payload?.user || payload?.data?.user || null;
}

/**
 * Register a new user
 * @param {Object} userData - User data (fullname, email, phone, password, role, status)
 * @returns {{ user: { id: string, fullname: string, email: string, role: string, status?: string }, token: string }} Created user object (without password) and token
 */
async function registerUser(userData) {
  ensureSupabaseConfigured();

  const { fullname, email, phone, password, role, status, learnerProfile } = userData;
  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseClientOrThrow();

  const verificationCode = role === 'learner' ? generateSixDigitCode() : null;
  const emailVerified = role !== 'learner';
  const finalRole = role || 'client';
  const finalStatus = status || (finalRole === 'learner' ? 'pending' : 'approved');

  console.log(`[registerUser] Creating ${finalRole} user: ${normalizedEmail}, verificationCode: "${verificationCode}"`);

  let createdUser = null;
  let signUpError = null;

  try {
    const signUpResponse = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          fullname,
          phone: phone || '',
          role: finalRole,
          status: finalStatus,
          learnerProfile: learnerProfile || {},
          verificationCode,
          emailVerified,
        },
      },
    });

    createdUser = signUpResponse.data;
    signUpError = signUpResponse.error;
  } catch (error) {
    signUpError = error;
  }

  if (signUpError || !createdUser?.user) {
    if (isSupabaseRateLimitError(signUpError)) {
      console.warn(`[registerUser] Supabase signUp hit a rate limit for ${normalizedEmail}; trying service-role fallback`);
      const fallbackUser = await createUserWithAdminApi({
        fullname,
        email: normalizedEmail,
        phone,
        password,
        role: finalRole,
        status: finalStatus,
        learnerProfile,
        verificationCode,
        emailVerified,
      });

      if (!fallbackUser) {
        throw signUpError || new Error('Unable to create Supabase user');
      }

      createdUser = { user: fallbackUser };
    } else {
      throw signUpError || new Error('Unable to create Supabase user');
    }
  }

  const token = generateToken(mapSupabaseUser(createdUser.user));
  const userWithoutPassword = mapSupabaseUser(createdUser.user);

  return {
    user: {
      ...userWithoutPassword,
      id: userWithoutPassword.id,
    },
    token,
    verificationCode,
  };
}

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {{ user: { id: string, fullname: string, email: string, role: string, status?: string }, token: string }} User object (without password) and token
 */
async function loginUser(credentials) {
  ensureSupabaseConfigured();

  const { email, password } = credentials;
  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseClientOrThrow();

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (signInError || !signInData?.user) {
    throw new Error('Invalid email or password');
  }

  const mappedUser = mapSupabaseUser(signInData.user);
  const accountStatus = mappedUser.status || 'approved';

  if (mappedUser.role === 'learner' && accountStatus !== 'approved') {
    if (accountStatus === 'pending') {
      throw new Error('Learner account is pending approval');
    }
    if (accountStatus === 'rejected') {
      throw new Error('Learner application has been rejected');
    }
  }

  if (mappedUser.role === 'learner' && !mappedUser.emailVerified) {
    throw new Error('Email address not verified. Please verify your email before logging in.');
  }

  const token = generateToken(mappedUser);
  const userWithoutPassword = mappedUser;

  return {
    user: {
      ...userWithoutPassword,
      id: userWithoutPassword.id,
    },
    token,
  };
}

async function verifyUserEmail(email, code) {
  ensureSupabaseConfigured();

  const normalizedEmail = normalizeEmail(email);
  const verificationCode = sanitizeVerificationCode(code);
  const supabase = getSupabaseAdminClient();

  console.log(`[verifyUserEmail] Looking up user with email: "${normalizedEmail}"`);
  const { data: existingUsers, error: existingError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (existingError) {
    throw existingError;
  }

  const existingUser = existingUsers?.users?.find((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  if (!existingUser) {
    console.error(`[verifyUserEmail] User not found for email: "${normalizedEmail}"`);
    throw new Error('User not found');
  }

  const metadata = existingUser.user_metadata || {};
  if (existingUser.email_confirmed_at || metadata.emailVerified) {
    console.log(`[verifyUserEmail] Email already verified for user: ${existingUser.id}`);
    return mapSupabaseUser(existingUser);
  }

  console.log(`[verifyUserEmail] Stored code: "${metadata.verificationCode}", Provided code: "${verificationCode}"`);

  if (!metadata.verificationCode) {
    console.error(`[verifyUserEmail] No verification code stored for user: ${existingUser.id}`);
    throw new Error('Invalid verification code');
  }

  const storedCode = sanitizeVerificationCode(metadata.verificationCode);
  console.log(`[verifyUserEmail] After sanitization - Stored: "${storedCode}", Provided: "${verificationCode}"`);

  if (storedCode !== verificationCode) {
    console.error(`[verifyUserEmail] Code mismatch for user ${existingUser.id}`);
    throw new Error('Invalid verification code');
  }

  const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    user_metadata: {
      ...metadata,
      verificationCode: null,
      emailVerified: true,
    },
    app_metadata: {
      ...(existingUser.app_metadata || {}),
      emailVerified: true,
    },
  });

  if (error || !updatedUser?.user) {
    throw error || new Error('Unable to update Supabase user');
  }

  console.log(`[verifyUserEmail] Email verified successfully for user: ${updatedUser.user.id}`);
  return mapSupabaseUser(updatedUser.user);
}

async function resendVerificationCode(email) {
  ensureSupabaseConfigured();

  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseAdminClient();
  console.log(`[resendVerificationCode] Looking up user with email: "${normalizedEmail}"`);

  const { data: existingUsers, error: existingError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (existingError) {
    throw existingError;
  }

  const existingUser = existingUsers?.users?.find((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  if (!existingUser) {
    console.error(`[resendVerificationCode] User not found for email: "${normalizedEmail}"`);
    throw new Error('User not found');
  }

  const metadata = existingUser.user_metadata || {};
  if (existingUser.email_confirmed_at || metadata.emailVerified) {
    console.log(`[resendVerificationCode] Email already verified for user: ${existingUser.id}`);
    throw new Error('Email already verified');
  }

  const newCode = generateSixDigitCode();
  console.log(`[resendVerificationCode] Generated new code: "${newCode}" for user: ${existingUser.id}`);

  const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    user_metadata: {
      ...metadata,
      verificationCode: newCode,
    },
  });

  if (error || !updatedUser?.user) {
    throw error || new Error('Unable to update Supabase user');
  }

  console.log(`[resendVerificationCode] Saved new code to Supabase: "${newCode}"`);
  return mapSupabaseUser(updatedUser.user);
}

async function requestPasswordReset(email) {
  ensureSupabaseConfigured();

  const normalizedEmail = normalizeEmail(email);
  const supabase = getSupabaseAdminClient();
  const { data: existingUsers, error: existingError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (existingError) {
    throw existingError;
  }

  const existingUser = existingUsers?.users?.find((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  if (!existingUser) {
    return null;
  }

  const metadata = existingUser.user_metadata || {};
  const resetPasswordCode = generateSixDigitCode();
  const resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);

  const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    user_metadata: {
      ...metadata,
      resetPasswordCode,
      resetPasswordExpires: resetPasswordExpires.toISOString(),
    },
  });

  if (error) {
    throw error;
  }

  await sendNotificationEmail(
    { email: existingUser.email, fullname: metadata.fullname || 'User' },
    'Password reset request',
    `Your password reset code is ${resetPasswordCode}. It will expire in 1 hour.`
  );

  if (metadata.phone) {
    await sendSMS({
      to: metadata.phone,
      body: `Your password reset code is ${resetPasswordCode}. It expires in 1 hour.`,
    });
  }

  return mapSupabaseUser(existingUser);
}

async function resetPassword(email, code, newPassword) {
  ensureSupabaseConfigured();

  const normalizedEmail = normalizeEmail(email);
  const sanitizedCode = sanitizeVerificationCode(code);
  const supabase = getSupabaseAdminClient();
  const { data: existingUsers, error: existingError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (existingError) {
    throw existingError;
  }

  const existingUser = existingUsers?.users?.find((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  if (!existingUser) {
    throw new Error('Invalid reset token or email');
  }

  const metadata = existingUser.user_metadata || {};
  if (!metadata.resetPasswordCode || metadata.resetPasswordCode !== sanitizedCode) {
    throw new Error('Invalid reset token or email');
  }

  const resetPasswordExpires = new Date(metadata.resetPasswordExpires || 0);
  if (!metadata.resetPasswordExpires || resetPasswordExpires < new Date()) {
    throw new Error('Reset token has expired');
  }

  const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: newPassword,
    user_metadata: {
      ...metadata,
      resetPasswordCode: null,
      resetPasswordExpires: null,
    },
  });

  if (error || !updatedUser?.user) {
    throw error || new Error('Unable to reset Supabase password');
  }

  return mapSupabaseUser(updatedUser.user);
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
  logoutUser,
  normalizeEmail,
  sanitizeVerificationCode,
  mapSupabaseUser,
  isSupabaseRateLimitError,
};
module.exports.default = module.exports;