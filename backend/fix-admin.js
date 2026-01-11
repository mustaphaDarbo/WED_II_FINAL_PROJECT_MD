const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the actual User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB Connected...');
  
  // Delete any existing admin user
  await User.deleteOne({ email: 'admin@ucums.edu' });
  
  // Create admin user with proper schema
  const admin = await User.create({
    fullName: 'System Administrator',
    email: 'admin@ucums.edu',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    profileImage: ''
  });
  
  console.log('Admin user created successfully!');
  console.log('Email: admin@ucums.edu');
  console.log('Password: admin123');
  console.log('Role: admin');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
