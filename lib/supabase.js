/* eslint-disable @typescript-eslint/no-require-imports */
// Bridge to the shared lib/supabase client implementations
const client = require('./supabase/client');

module.exports = {
  getSupabaseClient: client.getSupabaseClient,
  getSupabaseAdminClient: client.getSupabaseAdminClient,
  isSupabaseConfigured: client.isSupabaseConfigured,
};

module.exports.default = module.exports;
