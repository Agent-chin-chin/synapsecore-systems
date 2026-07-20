const CustomerStory = require('../lib/models/CustomerStory');

async function getCustomerStories() {
  return await CustomerStory.find();
}

async function createCustomerStory({ customerName, story, logoUrl }) {
  const cs = new CustomerStory({ customerName, story, logoUrl });
  await cs.save();
  return cs;
}

module.exports = { getCustomerStories, createCustomerStory };
