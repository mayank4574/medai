const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Verify the token is active in sessions
      const isValidSession = user.sessions.some(s => s.token === token);
      if (!isValidSession && user.sessions.length > 0) {
        // If sessions exist but this token isn't among them, it was revoked.
        // If no sessions exist, it might be an older user missing the sessions array, allow them until next login.
        return res.status(401).json({ message: 'Session expired or revoked' });
      }

      req.user = user;
      req.token = token; // Store token for logout-all filtering
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
