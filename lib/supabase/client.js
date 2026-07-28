/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

let publicClient = null;
let adminClient = null;

function buildClient(apiKey) {
  if (!config.SUPABASE_URL || !apiKey) return null;

  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = require('ws');
  }

  return createClient(config.SUPABASE_URL, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

if (config.SUPABASE_URL) {
  publicClient = buildClient(config.SUPABASE_ANON_KEY);
  adminClient = buildClient(config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY);
}

function getSupabaseClient() {
  return adminClient || publicClient;
}

function getSupabaseAdminClient() {
  return adminClient || publicClient;
}

function isSupabaseConfigured() {
  return Boolean(getSupabaseClient());
}

module.exports = {
  getSupabaseClient,
  getSupabaseAdminClient,
  isSupabaseConfigured,
};
module.exports.default = module.exports;
