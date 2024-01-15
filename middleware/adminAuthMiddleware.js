
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema');
const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
  }

  try {
    const secretKey = '#sgh$k6hkdj_4673@yiui';
    const tokenWithoutBearer = token.slice(7); 
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    
    const admin = await Admin.findById(decoded.admin._id);
    if (!admin) {
      return res.status(500).json({ message: 'Admin not properly authenticated' });
    }

    req.admin = admin;

    if (!req.admin || !req.admin._id) {
      return res.status(500).json({ message: 'Admin not properly authenticated' });
    }

    if (req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not authorized as an admin.' });
    }

    next();
  } catch (error) {
    console.error('Error in admin authentication middleware:', error);
    res.status(401).json({ message: 'You are not Authorized!' });
  }
};

module.exports = { authenticateAdmin };


