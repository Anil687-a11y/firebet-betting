const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  matchType: {
    type: String,
    enum: ['1v1', '2v2', '3v3', '4v4'],
    required: true
  },
  stakeAmount: {
    type: Number,
    required: true,
    min: 20,
    max: 1000
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'disputed', 'cancelled'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  results: {
    creator: {
      screenshot: String,
      submittedAt: Date
    },
    opponent: {
      screenshot: String,
      submittedAt: Date
    }
  },
  dispute: {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    proof: String,
    reason: String,
    submittedAt: Date
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: String
});

module.exports = mongoose.model('Room', roomSchema);
