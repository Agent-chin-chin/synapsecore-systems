import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberbugfixer';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@cyberbugfixer.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    const admin = new User({
      fullname: 'Admin User',
      email: 'admin@cyberbugfixer.com',
      phone: '+1234567890',
      password: hashedPassword,
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