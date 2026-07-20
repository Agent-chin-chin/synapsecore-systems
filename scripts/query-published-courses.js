const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const uri = process.env.MONGODB_URI;

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    level: String,
    price: Number,
    duration: String,
    thumbnail: String,
    modules: Array,
    quizzes: Array,
    certificate: Object,
    instructor: Object,
    rating: Number,
    enrollmentCount: Number,
    completionRate: Number,
    published: Boolean,
    featured: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'courses' }
);

const Course = mongoose.model('Course', courseSchema);

(async () => {
  try {
    await mongoose.connect(uri, { dbName: 'synapsecoresystem', bufferCommands: false });
    const courses = await Course.find({ published: true }).lean().limit(100);
    if (!courses.length) {
      console.log('NO_PUBLISHED_COURSES');
    } else {
      console.log(JSON.stringify(courses.map((c) => ({ title: c.title, category: c.category, level: c.level, price: c.price, id: c._id })), null, 2));
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
