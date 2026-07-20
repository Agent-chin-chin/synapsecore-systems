const StatusPage = require('../lib/models/StatusPage');

async function getStatus() {
  return await StatusPage.findOne().sort({ updatedAt: -1 });
}

async function updateStatus({ status, message, updatedBy }) {
  const newStatus = new StatusPage({ status, message, updatedBy });
  await newStatus.save();
  return newStatus;
}

module.exports = { getStatus, updateStatus };
