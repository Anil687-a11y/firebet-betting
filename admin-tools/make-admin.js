// Make user an admin
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../server/models/User');

async function makeAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log('Usage: node make-admin.js <email>');
      console.log('Example: node make-admin.js admin@example.com');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log('ℹ️  User is already an admin');
      process.exit(0);
    }

    user.isAdmin = true;
    await user.save();

    console.log('✅ User is now an admin!');
    console.log('👑 Email:', email);
    console.log('📱 They can now access Admin Panel');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
