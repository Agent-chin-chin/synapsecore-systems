const config = require('./config');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

async function paystackRequest(endpoint, method = 'GET', body = null) {
  const url = `${PAYSTACK_BASE_URL}${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${config.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.status) {
    const error = new Error(data.message || 'Paystack request failed');
    error.status = response.status;
    error.paystackResponse = data;
    throw error;
  }

  return data.data;
}

async function initializePayment({ email, amount, metadata = {} }) {
  const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  return paystackRequest('/transaction/initialize', 'POST', {
    email,
    amount: Math.round(amount * 100),
    reference,
    metadata,
    callback_url: `${baseUrl}/api/paystack/verify?reference=${reference}`,
  });
}

async function verifyPayment(reference) {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, 'GET');
}

async function fetchTransaction(reference) {
  return paystackRequest(`/transaction/${encodeURIComponent(reference)}`, 'GET');
}

module.exports = {
  initializePayment,
  verifyPayment,
  fetchTransaction,
};
