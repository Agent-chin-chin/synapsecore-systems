/* eslint-disable @typescript-eslint/no-require-imports */
const { getSupabaseAdminClient } = require('./client.js');

async function getUserFromAccessToken(accessToken) {
  const admin = getSupabaseAdminClient();
  if (!admin || !accessToken) return null;

  try {
    const { data, error } = await admin.auth.getUser(accessToken);
    if (error) return null;
    return data?.user || null;
  } catch (e) {
    return null;
  }
}

module.exports = {
  getUserFromAccessToken,
};

module.exports.default = module.exports;
