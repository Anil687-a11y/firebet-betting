const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  freeFireUID: {
    type: String,
    required: true,
    unique: true
  },
  freeFireName: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String
  },
  wallet: {
    depositBalance: {
      type: Number,
      default: 0
    },
    winningBalance: {
      type: Number,
      default: 0
    }
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banDetails: {
    type: {
      type: String,
      enum: ['temporary', 'permanent']
    },
    reason: String,
    until: Date
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for total balance
userSchema.virtual('totalBalance').get(function() {
  return this.wallet.depositBalance + this.wallet.winningBalance;
});

module.exports = mongoose.model('User', userSchema);
