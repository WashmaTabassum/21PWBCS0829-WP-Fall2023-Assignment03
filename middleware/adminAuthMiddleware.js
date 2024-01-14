
const jwt = require('jsonwebtoken');
const User = require('../models/adminSchema');
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
  }
  try {
    const secretKey = '#sgh$k6hkdj_4673@yiui';
    const tokenWithoutBearer = token.slice(7);
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    req.admin = decoded.admin;
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not authorized as an admin.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not Authorized!' });
  }
};
module.exports = { authenticateAdmin };

