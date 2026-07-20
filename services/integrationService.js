const Integration = require('../lib/models/Integration');

async function getIntegrations() {
  return await Integration.find().populate('createdBy', 'fullname email');
}

async function createIntegration({ name, type, config, createdBy }) {
  const integration = new Integration({ name, type, config, createdBy });
  await integration.save();
  return integration;
}

module.exports = { getIntegrations, createIntegration };
