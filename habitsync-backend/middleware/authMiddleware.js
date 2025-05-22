const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware to validate JWT Token
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      throw new Error();
    }

    req.user = user; // Attach the user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
// module.exports = { auth };
