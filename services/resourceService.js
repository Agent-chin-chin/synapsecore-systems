const Resource = require('../lib/models/Resource');

async function getResources() {
  return await Resource.find().populate('createdBy', 'fullname email');
}

async function createResource({ title, description, url, type, createdBy }) {
  const resource = new Resource({ title, description, url, type, createdBy });
  await resource.save();
  return resource;
}

module.exports = { getResources, createResource };
