const { getSupabaseAdminClient, getSupabaseClient } = require('../client');

const client = getSupabaseAdminClient() || getSupabaseClient();

async function createEnrollment(payload) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('enrollments').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

async function getEnrollmentsByLearner(learnerId) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('enrollments').select('*').eq('learner_id', learnerId);
  if (error) throw error;
  return data || [];
}

async function updateEnrollment(id, payload) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('enrollments').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

module.exports = {
  createEnrollment,
  getEnrollmentsByLearner,
  updateEnrollment,
};

module.exports.default = module.exports;
