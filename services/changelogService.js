const Changelog = require('../lib/models/Changelog');

async function getChangelogs() {
  return await Changelog.find().populate('createdBy', 'fullname email');
}

async function createChangelog({ title, description, version, releasedAt, createdBy }) {
  const c = new Changelog({ title, description, version, releasedAt, createdBy });
  await c.save();
  return c;
}

module.exports = { getChangelogs, createChangelog };
