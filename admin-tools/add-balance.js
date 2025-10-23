// Add balance to user account (for manual deposits)
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../server/models/User');
const Transaction = require('../server/models/Transaction');

async function addBalance() {
  try {
    const email = process.argv[2];
    const amount = Number(process.argv[3]);

    if (!email || !amount) {
      console.log('Usage: node add-balance.js <email> <amount>');
      console.log('Example: node add-balance.js user@example.com 500');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      process.exit(1);
    }

    console.log('\n📊 Before:');
    console.log('Deposit Balance:', user.wallet.depositBalance);
    console.log('Winning Balance:', user.wallet.winningBalance);
    console.log('Total:', user.wallet.depositBalance + user.wallet.winningBalance);

    user.wallet.depositBalance += amount;
    await user.save();

    await new Transaction({
      user: user._id,
      type: 'deposit',
      amount,
      balanceType: 'deposit',
      description: `Manual deposit by admin - ₹${amount}`
    }).save();

    console.log('\n✅ Balance Added!');
    console.log('📊 After:');
    console.log('Deposit Balance:', user.wallet.depositBalance);
    console.log('Winning Balance:', user.wallet.winningBalance);
    console.log('Total:', user.wallet.depositBalance + user.wallet.winningBalance);
    console.log('\n💰 Added: ₹' + amount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addBalance();
