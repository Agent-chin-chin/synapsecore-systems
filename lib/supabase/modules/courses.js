const { getSupabaseAdminClient, getSupabaseClient } = require('../client');

const client = getSupabaseAdminClient() || getSupabaseClient();

async function listCourses(filter = {}) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  let query = client.from('courses').select('*');

  if (filter.category) query = query.eq('category', filter.category);
  if (filter.level) query = query.eq('level', filter.level);

  const { data, error } = await query.order('category', { ascending: true }).order('level', { ascending: true }).order('price', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function createCourse(payload) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('courses').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

module.exports = {
  listCourses,
  createCourse,
};

module.exports.default = module.exports;
