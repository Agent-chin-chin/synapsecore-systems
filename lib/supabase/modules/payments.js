const { getSupabaseAdminClient, getSupabaseClient } = require('../client');

const client = getSupabaseAdminClient() || getSupabaseClient();

async function listPayments(filter = {}) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  let query = client.from('payments').select('*');
  if (filter.status) query = query.eq('status', filter.status);
  if (filter.paymentMethod) query = query.eq('payment_method', filter.paymentMethod);
  if (filter.userId) query = query.eq('user_id', filter.userId);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function createPayment(payload) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('payments').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

async function updatePayment(id, payload) {
  if (!client) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await client.from('payments').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

module.exports = {
  listPayments,
  createPayment,
  updatePayment,
};

module.exports.default = module.exports;
