// first attempt middleware wala
// authMiddleware.js

// const jwt = require('jsonwebtoken');

// const authenticateUser = (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: 'Authentication token not found' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_secret_key');
//         req.userData = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = { authenticateUser };

//token invalid wala attempt
// const jwt = require('jsonwebtoken');

// // Middleware to verify user token and role
// const authenticateUser = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Authorization denied. No token provided.' });
//   }

//   try {
//     // In authMiddleware.js for verifying the token
//     const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC';
//     const decoded = jwt.verify(token, secretKey);
//     // const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
//     req.user = decoded.user;
//     if (req.user.role !== 'user') {
//       return res.status(403).json({ message: 'Access denied. Not authorized as a user.' });
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = { authenticateUser };

const jwt = require('jsonwebtoken');

// Middleware to verify user token and role
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
  }

  try {
    const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC';
    const tokenWithoutBearer = token.slice(7); // Remove 'Bearer ' from the token
    console.log('Token without Bearer:', tokenWithoutBearer);

    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    console.log('Decoded Token:', decoded);

    req.user = decoded.user;

    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. Not authorized as a user.' });
    }

    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ message: 'Signin First' });
  }
};

module.exports = { authenticateUser };

