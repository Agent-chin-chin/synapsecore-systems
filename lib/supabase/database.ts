import { getSupabaseAdminClient, getSupabaseClient } from './client';

export function getDatabaseClient(useAdmin = false) {
  return useAdmin ? getSupabaseAdminClient() : getSupabaseClient();
}
