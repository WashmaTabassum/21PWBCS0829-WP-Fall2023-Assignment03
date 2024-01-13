// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const Admin = require('../models/adminSchema.js');

// const router = express.Router();

// // Admin Sign-up endpoint
// router.post('/admin/signup', [
//   body('username').isLength({ min: 5 }).withMessage('Username should be at least 5 characters long'),
//   body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, password } = req.body;

//   try {
//     const existingAdmin = await Admin.findOne({ username });
//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ username, password: hashedPassword });
//     await newAdmin.save();
//     res.status(201).json({ message: 'Admin registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering admin' });
//   }
// });

// // Admin Sign-in endpoint
// router.post('/admin/signin', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ username });
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     const validPassword = await bcrypt.compare(password, admin.password);
//     if (!validPassword) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     res.status(200).json({ message: 'Admin Sign-in successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error signing in' });
//   }
// });

// module.exports = router;




const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/adminSchema.js');
const jwt = require('jsonwebtoken');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware'); // Import the admin authentication middleware
const router = express.Router();

// Admin Sign-up endpoint
router.post('/admin/signup', [
  body('username').isLength({ min: 5 }).withMessage('Username should be at least 5 characters long'),
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin' });
  }
});

// Admin Sign-in endpoint
router.post('/admin/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // res.status(200).json({ message: 'Admin Sign-in successful' });
    const token = jwt.sign({ admin }, '#sgh$k6478*dhkdj_4673@yiui'); // Replace 'your_secret_key' with your actual secret key

        res.status(200).json({ message: 'Admin Sign-in successful', token }); // Sending the generated token in response
    
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});
// Example route protected by admin authentication middleware
router.get('/admin/dashboard', adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  // This route can only be accessed by admins
  res.send('Admin dashboard');
});

module.exports = router;


// first attempt middleware wala
//after middleware
// adminRoutes.js and authRoutes.js



// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const jwt = require('jsonwebtoken');
// const Admin = require('../models/adminSchema.js');

// const router = express.Router();
// const { authenticateUser } = require('../middleware/authMiddleware');

// // Apply middleware for routes that require authentication
// router.get('/some-protected-route', authenticateUser, (req, res) => {
//     // Handle logic for protected route after authentication
// });
// // Admin Sign-up endpoint
// router.post('/admin/signup', [
//   body('username').isLength({ min: 5 }).withMessage('Username should be at least 5 characters long'),
//   body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, password } = req.body;

//   try {
//     const existingAdmin = await Admin.findOne({ username });
//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ username, password: hashedPassword });
//     await newAdmin.save();
//     res.status(201).json({ message: 'Admin registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering admin' });
//   }
// });

// // Admin Sign-in endpoint
// router.post('/signin', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const admin = await Admin.findOne({ username });
//         if (!admin) {
//             return res.status(404).json({ message: 'Admin not found' });
//         }

//         const validPassword = await bcrypt.compare(password, admin.password);
//         if (!validPassword) {
//             return res.status(401).json({ message: 'Invalid password' });
//         }

//         // Generate JWT token upon successful login
//         const token = jwt.sign({ adminId: admin._id }, 'your_secret_key', { expiresIn: '1h' });
//         res.status(200).json({ token });
//     } catch (error) {
//         res.status(500).json({ message: 'Error signing in' });
//     }
// });

// module.exports = router;
