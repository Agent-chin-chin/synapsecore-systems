const { getSupabaseAdminClient, getSupabaseClient } = require('../client');

const client = getSupabaseAdminClient() || getSupabaseClient();

async function listPublishedCourses(filter = {}) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  let query = client.from('courses').select('*').eq('published', true);

  if (filter.category) query = query.eq('category', filter.category);
  if (filter.level) query = query.eq('level', filter.level);
  if (filter.search) {
    query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

module.exports = {
  listPublishedCourses,
};

module.exports.default = module.exports;
