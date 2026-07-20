const ApiKey = require('../lib/models/ApiKey');

async function getApiKeys() {
  return await ApiKey.find().populate('user', 'fullname email');
}

async function createApiKey({ user, label, scopes }) {
  const key = ApiKey.generateKey();
  const apiKey = new ApiKey({ key, user, label, scopes });
  await apiKey.save();
  return apiKey;
}

module.exports = { getApiKeys, createApiKey };
