const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/adminSchema.js');
const jwt = require('jsonwebtoken');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
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
    console.log(newAdmin)
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
    console.log(admin);
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const secretKey= '#sgh$k6hkdj_4673@yiui';
    const token = jwt.sign({ admin }, secretKey);

        res.status(200).json({ message: 'Admin Sign-in successful', token }); 
    
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});

router.get('/admin/dashboard', adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  const dashboardMessage = `
    Welcome to the Admin Dashboard!
    For all products go to /allproducts
    For add products go to /addproducts
    For remove products go to /products/:id
    For update products go to /products/:id
  `;

  res.send(dashboardMessage);
});

module.exports = router;
