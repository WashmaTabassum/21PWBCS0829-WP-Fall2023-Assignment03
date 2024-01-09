const jwt = require('jsonwebtoken');

// Middleware to verify admin token and role
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
    req.admin = decoded.admin;
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not authorized as an admin.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateAdmin };
