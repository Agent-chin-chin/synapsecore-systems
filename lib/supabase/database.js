/* eslint-disable @typescript-eslint/no-require-imports */
const { getSupabaseClient, getSupabaseAdminClient } = require('./client.js');

function getDatabaseClient(useAdmin = false) {
  return useAdmin ? getSupabaseAdminClient() : getSupabaseClient();
}

module.exports = {
  getDatabaseClient,
};

module.exports.default = module.exports;
