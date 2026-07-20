const Webhook = require('../lib/models/Webhook');

async function getWebhooks() {
  return await Webhook.find().populate('createdBy', 'fullname email');
}

async function createWebhook({ url, event, secret, createdBy }) {
  const webhook = new Webhook({ url, event, secret, createdBy });
  await webhook.save();
  return webhook;
}

module.exports = { getWebhooks, createWebhook };
