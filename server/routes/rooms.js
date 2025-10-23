const express = require('express');
const router = express.Router();
const multer = require('multer');
const Room = require('../models/Room');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create room
router.post('/create', auth, async (req, res) => {
  try {
    const { roomId, password, matchType, stakeAmount } = req.body;

    // Validate stake amount (multiples of 5, between 20-1000)
    if (stakeAmount < 20 || stakeAmount > 1000 || stakeAmount % 5 !== 0) {
      return res.status(400).json({ error: 'Invalid stake amount. Must be between ₹20-₹1000 and multiple of 5' });
    }

    // Check if user has enough balance
    const totalBalance = req.user.wallet.depositBalance + req.user.wallet.winningBalance;
    if (totalBalance < stakeAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from wallet (prioritize deposit balance first)
    let remaining = stakeAmount;
    if (req.user.wallet.depositBalance >= remaining) {
      req.user.wallet.depositBalance -= remaining;
    } else {
      remaining -= req.user.wallet.depositBalance;
      req.user.wallet.depositBalance = 0;
      req.user.wallet.winningBalance -= remaining;
    }
    await req.user.save();

    // Create room with 1 hour deadline
    const deadline = new Date(Date.now() + 60 * 60 * 1000);
    
    const room = new Room({
      roomId,
      password,
      matchType,
      stakeAmount,
      creator: req.user._id,
      deadline
    });

    await room.save();

    // Record transaction
    await new Transaction({
      user: req.user._id,
      type: 'bet',
      amount: -stakeAmount,
      balanceType: 'deposit',
      room: room._id,
      description: `Bet placed for room ${roomId}`
    }).save();

    res.status(201).json({ 
      message: 'Room created successfully',
      room: await room.populate('creator', 'freeFireUID freeFireName')
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get all available rooms
router.get('/available', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      status: 'waiting',
      creator: { $ne: req.user._id }
    })
    .populate('creator', 'freeFireUID freeFireName')
    .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Fetch rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Join room
router.post('/:roomId/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate('creator', 'freeFireUID freeFireName');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not available' });
    }

    if (room.creator._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot join your own room' });
    }

    // Check balance
    const totalBalance = req.user.wallet.depositBalance + req.user.wallet.winningBalance;
    if (totalBalance < room.stakeAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from wallet
    let remaining = room.stakeAmount;
    if (req.user.wallet.depositBalance >= remaining) {
      req.user.wallet.depositBalance -= remaining;
    } else {
      remaining -= req.user.wallet.depositBalance;
      req.user.wallet.depositBalance = 0;
      req.user.wallet.winningBalance -= remaining;
    }
    await req.user.save();

    // Update room
    room.opponent = req.user._id;
    room.status = 'active';
    await room.save();

    // Record transaction
    await new Transaction({
      user: req.user._id,
      type: 'bet',
      amount: -room.stakeAmount,
      balanceType: 'deposit',
      room: room._id,
      description: `Joined room ${room.roomId}`
    }).save();

    res.json({ 
      message: 'Joined room successfully',
      room: await room.populate('opponent', 'freeFireUID freeFireName')
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Delete room (before opponent joins)
router.delete('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Cannot delete room after opponent joined' });
    }

    // Refund stake amount
    req.user.wallet.depositBalance += room.stakeAmount;
    await req.user.save();

    // Record refund transaction
    await new Transaction({
      user: req.user._id,
      type: 'refund',
      amount: room.stakeAmount,
      balanceType: 'deposit',
      room: room._id,
      description: `Refund for cancelled room ${room.roomId}`
    }).save();

    await Room.findByIdAndDelete(req.params.roomId);

    res.json({ message: 'Room deleted and amount refunded' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Submit result screenshot
router.post('/:roomId/submit-result', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status !== 'active') {
      return res.status(400).json({ error: 'Room is not active' });
    }

    // Check if deadline passed
    if (new Date() > room.deadline) {
      return res.status(400).json({ error: 'Submission deadline passed' });
    }

    const isCreator = room.creator.toString() === req.user._id.toString();
    const isOpponent = room.opponent.toString() === req.user._id.toString();

    if (!isCreator && !isOpponent) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot required' });
    }

    // Save screenshot
    if (isCreator) {
      room.results.creator = {
        screenshot: req.file.path,
        submittedAt: new Date()
      };
    } else {
      room.results.opponent = {
        screenshot: req.file.path,
        submittedAt: new Date()
      };
    }

    await room.save();

    res.json({ message: 'Result submitted successfully' });
  } catch (error) {
    console.error('Submit result error:', error);
    res.status(500).json({ error: 'Failed to submit result' });
  }
});

// Submit dispute
router.post('/:roomId/dispute', auth, upload.single('proof'), async (req, res) => {
  try {
    const { reason } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status !== 'active') {
      return res.status(400).json({ error: 'Can only dispute active rooms' });
    }

    if (new Date() > room.deadline) {
      return res.status(400).json({ error: 'Dispute deadline passed' });
    }

    const isParticipant = room.creator.toString() === req.user._id.toString() || 
                          room.opponent.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    room.dispute = {
      reportedBy: req.user._id,
      proof: req.file ? req.file.path : null,
      reason,
      submittedAt: new Date()
    };
    room.status = 'disputed';

    await room.save();

    res.json({ message: 'Dispute submitted successfully' });
  } catch (error) {
    console.error('Dispute error:', error);
    res.status(500).json({ error: 'Failed to submit dispute' });
  }
});

// Get user's active rooms
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { creator: req.user._id },
        { opponent: req.user._id }
      ],
      status: { $in: ['waiting', 'active', 'disputed'] }
    })
    .populate('creator', 'freeFireUID freeFireName')
    .populate('opponent', 'freeFireUID freeFireName')
    .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Fetch my rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

module.exports = router;
