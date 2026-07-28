import { getSupabaseAdminClient } from './client';

export async function getUserFromAccessToken(accessToken: string | null) {
  const admin = getSupabaseAdminClient();
  if (!admin || !accessToken) return null;

  try {
    const { data, error } = await admin.auth.getUser(accessToken);
    if (error) return null;
    return data?.user || null;
  } catch {
    return null;
  }
}
