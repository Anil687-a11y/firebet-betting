const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
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
      // Unban if temporary ban expired
      if (user.banDetails.type === 'temporary' && new Date() >= user.banDetails.until) {
        user.isBanned = false;
        user.banDetails = {};
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { auth, adminAuth };
