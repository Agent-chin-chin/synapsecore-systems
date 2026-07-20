const Faq = require('../lib/models/Faq');

async function getFaqs() {
  return await Faq.find().populate('createdBy', 'fullname email');
}

async function createFaq({ question, answer, createdBy }) {
  const faq = new Faq({ question, answer, createdBy });
  await faq.save();
  return faq;
}

module.exports = { getFaqs, createFaq };
