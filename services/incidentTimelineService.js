const IncidentTimeline = require('../lib/models/IncidentTimeline');

async function getIncidentTimelines() {
  return await IncidentTimeline.find().populate('incidentId').populate('createdBy', 'fullname email');
}

async function createIncidentTimeline({ incidentId, event, details, timestamp, createdBy }) {
  const t = new IncidentTimeline({ incidentId, event, details, timestamp, createdBy });
  await t.save();
  return t;
}

module.exports = { getIncidentTimelines, createIncidentTimeline };
