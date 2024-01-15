
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'User Authorization denied. Invalid token.' });
  }
  try {
    const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC';
    const tokenWithoutBearer = token.slice(7);
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    const user = await User.findById(decoded.user._id).populate('cart.product');
    if (!user) {
      return res.status(500).json({ message: 'User not properly authenticated' });
    }
    req.user = user;
    console.log('Decoded User:', req.user);
    if (!req.user || !req.user._id) {
      return res.status(500).json({ message: 'User not properly authenticated' });
    }
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ message: 'Signin First' });
  }
};
module.exports = { authenticateUser };
