const ThreatFeed = require('../lib/models/ThreatFeed');

async function getThreatFeeds() {
  return await ThreatFeed.find();
}

async function createThreatFeed({ title, description, severity, publishedAt, source }) {
  const t = new ThreatFeed({ title, description, severity, publishedAt, source });
  await t.save();
  return t;
}

module.exports = { getThreatFeeds, createThreatFeed };
