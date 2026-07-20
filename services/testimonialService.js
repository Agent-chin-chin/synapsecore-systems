const Testimonial = require('../lib/models/Testimonial');

async function getTestimonials() {
  return await Testimonial.find();
}

async function createTestimonial({ author, content, company }) {
  const t = new Testimonial({ author, content, company });
  await t.save();
  return t;
}

module.exports = { getTestimonials, createTestimonial };
