// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/userSchema.js');

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

//         res.status(200).send('Sign In successful');
//     } catch (error) {
//         res.status(500).send('Error signing in');
//     }
// });

// module.exports = router;



const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware
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
        const user = new User({ firstname, lastname, email, mobile, password: hashedPassword, address });
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

        // res.status(200).send('Sign In successful');
        // Generating token
        const secretKey = '#7kfE*4tGz$LQW9!sP@u2MxY6vJhNpC'; 

        // In authRoutes.js during user signin
        const token = jwt.sign({ user }, secretKey);



        res.status(200).json({ message: 'Sign In successful', token }); // Sending the generated token in response
    } catch (error) {
        res.status(500).send('Error signing in');
    }

    
});

// Example route protected by user authentication middleware
router.get('/user/profile', authMiddleware.authenticateUser, async (req, res) => {
    // This route can only be accessed by users
    res.send('User profile page');
  });

module.exports = router;


// first attempt middleware wala
//after middleware
// adminRoutes.js and authRoutes.js



// const express = require('express');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const User = require('../models/userSchema.js');

// const { authenticateUser } = require('../middleware/authMiddleware');

// // Apply middleware for routes that require authentication
// router.get('/some-protected-route', authenticateUser, (req, res) => {
//     // Handle logic for protected route after authentication
// });

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

//         // Generate JWT token upon successful login
//         const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
//         res.status(200).json({ token });
//     } catch (error) {
//         res.status(500).send('Error signing in');
//     }
// });

// module.exports = router;

