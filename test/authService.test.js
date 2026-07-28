const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { normalizeEmail, sanitizeVerificationCode, mapSupabaseUser, isSupabaseRateLimitError } = require('../services/authService');

function normalizeEmailLocal(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeVerificationCodeLocal(code) {
  return String(code || '').replace(/\D/g, '').trim();
}

test('normalizeEmail trims and lowercases addresses', () => {
  assert.equal(normalizeEmail('  User@Example.COM  '), 'user@example.com');
  assert.equal(normalizeEmailLocal('  User@Example.COM  '), 'user@example.com');
});

test('sanitizeVerificationCode keeps only digits and spaces', () => {
  assert.equal(sanitizeVerificationCode(' 1-2 3 45 6 '), '123456');
  assert.equal(sanitizeVerificationCodeLocal(' 1-2 3 45 6 '), '123456');
});

test('sanitizeVerificationCode handles pasted codes', () => {
  assert.equal(sanitizeVerificationCode('123-456'), '123456');
  assert.equal(sanitizeVerificationCode('123 456'), '123456');
  assert.equal(sanitizeVerificationCode('123456'), '123456');
  assert.equal(sanitizeVerificationCodeLocal('123-456'), '123456');
});

test('mapSupabaseUser builds the legacy auth shape', () => {
  const user = mapSupabaseUser({
    id: 'supabase-user-id',
    email: 'learner@example.com',
    user_metadata: { fullname: 'Learner User', phone: '+2348000000000', role: 'learner' },
    app_metadata: { role: 'learner' }
  });

  assert.equal(user.id, 'supabase-user-id');
  assert.equal(user.email, 'learner@example.com');
  assert.equal(user.fullname, 'Learner User');
  assert.equal(user.role, 'learner');
});

test('isSupabaseRateLimitError detects Supabase email rate-limit failures', () => {
  assert.equal(isSupabaseRateLimitError({ code: 'over_email_send_rate_limit' }), true);
  assert.equal(isSupabaseRateLimitError({ status: 429, message: 'email rate limit exceeded' }), true);
  assert.equal(isSupabaseRateLimitError({ status: 500, message: 'server error' }), false);
});
