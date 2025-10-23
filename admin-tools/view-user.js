// View user details
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../server/models/User');

async function viewUser() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log('Usage: node view-user.js <email>');
      console.log('Example: node view-user.js user@example.com');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      process.exit(1);
    }

    console.log('\n👤 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('Free Fire UID:', user.freeFireUID);
    console.log('Free Fire Name:', user.freeFireName);
    console.log('Verified:', user.isVerified ? '✅' : '❌');
    console.log('Admin:', user.isAdmin ? '👑 Yes' : 'No');
    console.log('Banned:', user.isBanned ? '🚫 Yes' : 'No');
    console.log('\n💰 Wallet:');
    console.log('Deposit Balance: ₹' + user.wallet.depositBalance);
    console.log('Winning Balance: ₹' + user.wallet.winningBalance);
    console.log('Total Balance: ₹' + (user.wallet.depositBalance + user.wallet.winningBalance));
    console.log('\n📅 Registered:', user.createdAt.toLocaleString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

viewUser();
