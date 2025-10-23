const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, freeFireUID, freeFireName } = req.body;

    // Validation
    if (!email || !password || !freeFireUID || !freeFireName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { freeFireUID }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Free Fire UID already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = generateCode();

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      freeFireUID,
      freeFireName,
      verificationCode
    });

    await user.save();

    // Send verification email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'FireBet - Email Verification',
        html: `
          <h2>Welcome to FireBet!</h2>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `
      });
    } catch (emailError) {
      console.error('Email send error (email not configured)');
      console.log('\n========================================');
      console.log('📧 VERIFICATION CODE FOR:', email);
      console.log('🔑 CODE:', verificationCode);
      console.log('========================================\n');
      // Continue even if email fails (for development)
    }

    res.status(201).json({ 
      message: 'Registration successful. Please check your email for verification code.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify email
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ 
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        freeFireUID: user.freeFireUID,
        freeFireName: user.freeFireName,
        wallet: user.wallet
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isBanned) {
      if (user.banDetails.type === 'permanent') {
        return res.status(403).json({ error: 'Account permanently banned' });
      }
      if (user.banDetails.type === 'temporary' && new Date() < user.banDetails.until) {
        return res.status(403).json({ 
          error: 'Account temporarily banned',
          until: user.banDetails.until
        });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        freeFireUID: user.freeFireUID,
        freeFireName: user.freeFireName,
        wallet: user.wallet,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      freeFireUID: req.user.freeFireUID,
      freeFireName: req.user.freeFireName,
      wallet: req.user.wallet,
      isAdmin: req.user.isAdmin
    }
  });
});

module.exports = router;
