const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const Product = require('../models/productSchema'); 
const Order = require('../models/orderSchema'); 
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Sign Up endpoint
router.post('/signup', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, mobile, password, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword,
      address,
      cart: [],
    });

    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Sign In endpoint
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }

    const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC';
    const token = jwt.sign({ user }, secretKey);

    res.status(200).json({ message: 'Sign In successful', token });
  } catch (error) {
    res.status(500).send('Error signing in');
  }
});

router.get('/user/dashboard', authMiddleware.authenticateUser, async (req, res) => {
  const dashboardMessage = `
    Welcome to the User Dashboard!
    For all products go to /product
    To add products to cart go to /cart/add
    To update products in cart go to /cart/update {for removal req.body action="remove", for updation req.body action="update}
    For checkout go to /checkout
    For Order History go to /orders
    For update profile go to /account/update
  `;

  res.send(dashboardMessage);
});

router.get('/product', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router.post('/cart/add',authMiddleware.authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const validObjectId = ObjectId.isValid(productId);
    if (!validObjectId) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const price = quantity * product.price;
if (!req.user || !req.user._id) {
  return res.status(500).json({ message: 'User not properly authenticated' });
}
    req.user.cart.push({ product: productId, quantity, price });
    await req.user.save();

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding item to cart');
  }
});

router.patch('/cart/update', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const { productId, quantity, action } = req.body;
    const itemIndex = req.user.cart.findIndex(item => item.product._id.equals(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    const cartItem = req.user.cart[itemIndex];

    if (action === 'update') {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.product.price;
    } else if (action === 'remove') {
      req.user.cart.splice(itemIndex, 1);
    }

    await req.user.save();

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating cart');
  }
});

//checkout
router.post('/checkout', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const { shippingDetails, paymentMethod } = req.body;

    if (!['CashOnDelivery', 'CreditCard'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const totalPrice = req.user.cart.reduce((total, item) => total + item.price, 0);
    const order = new Order({
      user: req.user._id,
      products: req.user.cart,
      totalPrice: totalPrice,
      shippingDetails,
      paymentMethod
    });
    await order.save();
    req.user.cart = [];
    await req.user.save();

    const paymentReceipt = `Payment Receipt for Order ${order._id}\nTotal Amount: ${totalPrice}\nPayment Method: ${paymentMethod}\n`;

    res.json({ message: 'Order placed successfully', paymentReceipt });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing checkout');
  }
});

// View Order History
router.get('/orders', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching order history');
  }
});

// Manage Account Details
router.patch('/account/update', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const { firstname, lastname, mobile, address } = req.body;

    req.user.firstname = firstname;
    req.user.lastname = lastname;
    req.user.mobile = mobile;
    req.user.address = address;

    await req.user.save();

    res.json({ message: 'Account details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating account details');
  }
});

module.exports = router;




