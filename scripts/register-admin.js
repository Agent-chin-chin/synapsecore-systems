#!/usr/bin/env node

/**
 * Admin Registration Script
 * Creates the first Super Admin account
 * Usage: node scripts/register-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import User model
const User = require('../lib/models/User');

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyber-bug-fixer');
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      fullname: 'Admin',
      email: 'admin@synapsecoresystems.com',
      phone: '09134570621',
      password: 'Anthony@2',
      role: 'Super Admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', adminData.email);
      console.log('Admin Details:', {
        fullname: existingAdmin.fullname,
        email: existingAdmin.email,
        phone: existingAdmin.phone,
        role: existingAdmin.role
      });
      await mongoose.connection.close();
      return;
    }

    // Create new admin user
    console.log('📝 Creating Super Admin account...');
    const admin = new User({
      fullname: adminData.fullname,
      email: adminData.email,
      phone: adminData.phone,
      password: adminData.password,
      role: adminData.role
    });

    // Save admin (password will be hashed by pre-save hook)
    await admin.save();
    console.log('✅ Super Admin created successfully!');

    // Display admin details (without password)
    console.log('\n🎉 Admin Account Created:');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ' + admin.email);
    console.log('📱 Phone:    ' + admin.phone);
    console.log('👤 Name:     ' + admin.fullname);
    console.log('🔐 Role:     ' + admin.role);
    console.log('🆔 ID:       ' + admin._id);
    console.log('═══════════════════════════════════════');

    console.log('\n🔐 Login Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ' + adminData.email);
    console.log('🔑 Password: ' + adminData.password);
    console.log('═══════════════════════════════════════');

    console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
    console.log('\n✨ Admin setup complete!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.error('⚠️  Duplicate email error. Admin with this email already exists.');
    }
    process.exit(1);
  }
}

// Run the script
createAdmin();
