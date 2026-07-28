import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { WebSocket as NodeWebSocket } from 'ws';
import config from '../config';

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

type SupabaseClientInstance = ReturnType<typeof createClient>;

function buildClient(apiKey: string | undefined): SupabaseClientInstance | null {
  if (!config.SUPABASE_URL || !apiKey) return null;

  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = NodeWebSocket as unknown as typeof WebSocket;
  }

  return createClient(config.SUPABASE_URL, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
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
  return adminClient;
}

function isSupabaseConfigured() {
  return Boolean(getSupabaseClient());
}

export {
  getSupabaseClient,
  getSupabaseAdminClient,
  isSupabaseConfigured,
};
