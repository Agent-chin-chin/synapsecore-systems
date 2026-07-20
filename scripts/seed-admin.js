require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../lib/models/User');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "cyberbugfixer",
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@cyberbugfixer.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new User({
      fullname: 'Admin User',
      email: 'admin@cyberbugfixer.com',
      phone: '+1234567890',
      password: 'Admin123!',
      role: 'Super Admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@cyberbugfixer.com');
    console.log('Password: Admin123!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();