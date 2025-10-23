const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    res.json({
      wallet: req.user.wallet,
      totalBalance: req.user.wallet.depositBalance + req.user.wallet.winningBalance
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Deposit (eSewa integration placeholder)
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, transactionId } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // TODO: Verify eSewa transaction
    // For now, directly add to deposit balance

    req.user.wallet.depositBalance += amount;
    await req.user.save();

    await new Transaction({
      user: req.user._id,
      type: 'deposit',
      amount,
      balanceType: 'deposit',
      description: `Deposit via eSewa (${transactionId})`
    }).save();

    res.json({ 
      message: 'Deposit successful',
      wallet: req.user.wallet
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Deposit failed' });
  }
});

// Withdraw (only winning balance, minimum ₹150)
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount < 150) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is ₹150' });
    }

    if (req.user.wallet.winningBalance < amount) {
      return res.status(400).json({ error: 'Insufficient winning balance' });
    }

    // Check for negative balance (debt)
    const totalBalance = req.user.wallet.depositBalance + req.user.wallet.winningBalance;
    if (totalBalance < 0) {
      return res.status(400).json({ error: 'Cannot withdraw with pending debt' });
    }

    req.user.wallet.winningBalance -= amount;
    await req.user.save();

    await new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount: -amount,
      balanceType: 'winning',
      status: 'pending',
      description: `Withdrawal request for ₹${amount}`
    }).save();

    res.json({ 
      message: 'Withdrawal request submitted. Admin will process it soon.',
      wallet: req.user.wallet
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
