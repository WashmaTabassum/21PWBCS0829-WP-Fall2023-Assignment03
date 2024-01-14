
// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userSchema.js');
// const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware
// const router = express.Router();



// // Sign Up endpoint
// router.post('/signup', [
//     body('email').isEmail().withMessage('Please enter a valid email'),
//     body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstname, lastname, email, mobile, password, address } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ firstname, lastname, email, mobile, password: hashedPassword, address });
//         await user.save();
//         res.status(201).send('User registered');
//     } catch (error) {
//         res.status(500).send('Error registering user');
//     }
// });

// // Sign In endpoint
// router.post('/signin', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(401).send('Invalid password');
//         }

//         // res.status(200).send('Sign In successful');
//         // Generating token
//         const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC'; 

//         // In authRoutes.js during user signin
//         const token = jwt.sign({ user }, secretKey);



//         res.status(200).json({ message: 'Sign In successful', token }); // Sending the generated token in response
//     } catch (error) {
//         res.status(500).send('Error signing in');
//     }

    
// });

// // Example route protected by user authentication middleware
// router.get('/user/profile', authMiddleware.authenticateUser, async (req, res) => {
//     // This route can only be accessed by users
//     res.send('User profile page');
//   });

// module.exports = router;

//after user features
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const Product = require('../models/productSchema'); // Assuming you have a Product model
const Order = require('../models/orderSchema'); // Assuming you have an Order model
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
    // const user = new User({ firstname, lastname, email, mobile, password: hashedPassword, address });
    // await user.save();
    const user = new User({
      firstname,
      lastname,
      email,
      mobile,
      password, // Ensure you're properly hashing the password
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

// View Products with Sorting Options
router.get('/product', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

// Add Items to Cart
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Add Items to Cart
router.post('/cart/add', authMiddleware.authenticateUser, async (req, res) => {
  console.log('Token in Request Header:', req.header('Authorization'));

  try {
    const { productId, quantity } = req.body;

    // Convert the productId to ObjectId
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

    // Ensure req.user is an instance of the User model
    if (!(req.user instanceof User)) {
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


// Manage Cart Contents (Update Quantities and Remove Items)
router.patch('/cart/update', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const { productId, quantity, action } = req.body;

    const cartItem = req.user.cart.find(item => item.product === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    if (action === 'update') {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.product.price;
    } else if (action === 'remove') {
      req.user.cart = req.user.cart.filter(item => item.product !== productId);
    }

    await req.user.save();

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating cart');
  }
});

// Proceed to Checkout
router.post('/checkout', authMiddleware.authenticateUser, async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id,
      products: req.user.cart,
      totalPrice: req.user.cart.reduce((total, item) => total + item.price, 0)
    });

    await order.save();

    req.user.cart = [];
    await req.user.save();

    res.json({ message: 'Order placed successfully' });
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

// Manage Account Details (Update User Information)
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




