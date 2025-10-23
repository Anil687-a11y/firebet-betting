const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { adminAuth } = require('../middleware/auth');

// Get all rooms for admin review
router.get('/rooms', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = status ? { status } : {};
    
    const rooms = await Room.find(query)
      .populate('creator', 'email freeFireUID freeFireName wallet')
      .populate('opponent', 'email freeFireUID freeFireName wallet')
      .populate('winner', 'email freeFireUID freeFireName')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Admin fetch rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Declare winner and transfer money
router.post('/rooms/:roomId/declare-winner', adminAuth, async (req, res) => {
  try {
    const { winnerId, adminNotes } = req.body;
    
    const room = await Room.findById(req.params.roomId)
      .populate('creator')
      .populate('opponent');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status === 'completed') {
      return res.status(400).json({ error: 'Room already completed' });
    }

    const totalPool = room.stakeAmount * 2;
    const adminCommission = totalPool * 0.20; // 20%
    const winnerAmount = totalPool - adminCommission;

    // Find winner
    const winner = winnerId === room.creator._id.toString() ? room.creator : room.opponent;

    // Transfer winning amount
    winner.wallet.winningBalance += winnerAmount;
    await winner.save();

    // Record transaction
    await new Transaction({
      user: winner._id,
      type: 'win',
      amount: winnerAmount,
      balanceType: 'winning',
      room: room._id,
      description: `Won match ${room.roomId} - Admin verified`
    }).save();

    // Update room
    room.winner = winner._id;
    room.status = 'completed';
    room.adminNotes = adminNotes;
    await room.save();

    res.json({ 
      message: 'Winner declared and amount transferred',
      winnerAmount,
      adminCommission
    });
  } catch (error) {
    console.error('Declare winner error:', error);
    res.status(500).json({ error: 'Failed to declare winner' });
  }
});

// Handle expired rooms (no screenshots submitted)
router.post('/rooms/:roomId/expire', adminAuth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (new Date() <= room.deadline) {
      return res.status(400).json({ error: 'Room deadline not passed yet' });
    }

    const totalPool = room.stakeAmount * 2;

    // Money goes to admin (no refund)
    room.status = 'completed';
    room.adminNotes = 'Expired - No screenshots submitted. Amount forfeited to admin.';
    await room.save();

    await new Transaction({
      user: room.creator,
      type: 'admin_transfer',
      amount: -room.stakeAmount,
      balanceType: 'deposit',
      room: room._id,
      description: `Room expired - Amount forfeited`
    }).save();

    await new Transaction({
      user: room.opponent,
      type: 'admin_transfer',
      amount: -room.stakeAmount,
      balanceType: 'deposit',
      room: room._id,
      description: `Room expired - Amount forfeited`
    }).save();

    res.json({ 
      message: 'Room expired. Amount transferred to admin.',
      amount: totalPool
    });
  } catch (error) {
    console.error('Expire room error:', error);
    res.status(500).json({ error: 'Failed to expire room' });
  }
});

// Ban user
router.post('/users/:userId/ban', adminAuth, async (req, res) => {
  try {
    const { type, reason, days, penaltyAmount } = req.body;
    
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = true;
    user.banDetails = {
      type,
      reason,
      until: type === 'temporary' ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null
    };

    // Apply penalty
    if (penaltyAmount > 0) {
      const totalBalance = user.wallet.depositBalance + user.wallet.winningBalance;
      
      if (totalBalance >= penaltyAmount) {
        // Deduct from deposit first, then winning
        if (user.wallet.depositBalance >= penaltyAmount) {
          user.wallet.depositBalance -= penaltyAmount;
        } else {
          const remaining = penaltyAmount - user.wallet.depositBalance;
          user.wallet.depositBalance = 0;
          user.wallet.winningBalance -= remaining;
        }
      } else {
        // Create negative balance (debt)
        user.wallet.depositBalance = totalBalance - penaltyAmount;
      }

      await new Transaction({
        user: user._id,
        type: 'penalty',
        amount: -penaltyAmount,
        balanceType: 'deposit',
        description: `Penalty: ${reason}`
      }).save();
    }

    // If permanent ban, transfer remaining balance to admin
    if (type === 'permanent') {
      const remainingBalance = user.wallet.depositBalance + user.wallet.winningBalance;
      
      if (remainingBalance > 0) {
        await new Transaction({
          user: user._id,
          type: 'admin_transfer',
          amount: -remainingBalance,
          balanceType: 'deposit',
          description: 'Permanent ban - Balance transferred to admin'
        }).save();

        user.wallet.depositBalance = 0;
        user.wallet.winningBalance = 0;
      }
    }

    await user.save();

    res.json({ 
      message: `User ${type === 'permanent' ? 'permanently' : 'temporarily'} banned`,
      user: {
        id: user._id,
        email: user.email,
        banDetails: user.banDetails,
        wallet: user.wallet
      }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Unban user
router.post('/users/:userId/unban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = false;
    user.banDetails = {};
    await user.save();

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -verificationCode')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get pending withdrawals
router.get('/withdrawals', adminAuth, async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ 
      type: 'withdrawal',
      status: 'pending'
    })
    .populate('user', 'email freeFireUID freeFireName')
    .sort({ createdAt: -1 });

    res.json({ withdrawals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

// Approve withdrawal
router.post('/withdrawals/:transactionId/approve', adminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = 'completed';
    await transaction.save();

    res.json({ message: 'Withdrawal approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve withdrawal' });
  }
});

module.exports = router;
