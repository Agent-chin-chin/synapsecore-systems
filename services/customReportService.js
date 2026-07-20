const CustomReport = require('../lib/models/CustomReport');

async function getReports() {
  return await CustomReport.find().populate('createdBy', 'fullname email');
}

async function createReport({ title, description, createdBy, filters, data }) {
  const report = new CustomReport({ title, description, createdBy, filters, data });
  await report.save();
  return report;
}

module.exports = { getReports, createReport };
