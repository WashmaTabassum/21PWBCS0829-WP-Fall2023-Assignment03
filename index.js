// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const { body, validationResult } = require('express-validator');
// const User = require('./models/userSchema.js');
// const Admin = require('./models/adminSchema.js'); // Import Admin schema
// const authRoutes = require('./routes/authRoutes.js');
// const adminRoutes = require('./routes/adminRoutes.js'); // Import Admin authentication routes

// const app = express();
// app.use(express.json());

// const uri = 'mongodb://127.0.0.1:27017/My_Ecommerce'; // Replace with your MongoDB URI
// mongoose.connect(uri);

// const db = mongoose.connection;

// db.on('error', (err) => {
//   console.error('Database connection error:', err);
// });

// db.once('open', () => {
//   console.log('Database connected successfully');
//   // Mounting the authentication routes only after successful DB connection
//   app.use('/', authRoutes);
//   app.use('/', adminRoutes); // Mounting admin authentication routes

//   // Home page route
//   app.get('/', (req, res) => {
//     res.send('Welcome to the eCommerce web app!');
//     // Alternatively, you can send HTML content:
//     // res.send('<h1>Welcome to the eCommerce web app!</h1>');
//   });

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// });


const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const app = express();
app.use(express.json());

const uri = 'mongodb://127.0.0.1:27017/My_Ecommerce'; // Replace with your MongoDB URI
mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
  console.log('Database connected successfully');

  app.use('/', authRoutes); // Mounting user authentication routes
  app.use('/', adminRoutes); // Mounting admin authentication routes
  app.use('/', productRoutes);
  // Home page route
  app.get('/', (req, res) => {
    res.send('Welcome to the eCommerce web app!');
    // Alternatively, you can send HTML content:
    // res.send('<h1>Welcome to the eCommerce web app!</h1>');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});






// first attempt middleware wala
// const express = require('express');
// const mongoose = require('mongoose');
// const User = require('./models/userSchema');
// const Admin = require('./models/adminSchema');
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const productRoutes = require('./routes/productRoutes'); // Import product routes

// const app = express();
// app.use(express.json());

// const uri = 'mongodb://127.0.0.1:27017/My_Ecommerce';
// mongoose.connect(uri);

// const db = mongoose.connection;

// db.on('error', (err) => {
//   console.error('Database connection error:', err);
// });

// db.once('open', () => {
//   console.log('Database connected successfully');
//   app.use('/', authRoutes);
//   app.use('/', adminRoutes);
//   app.use('/', productRoutes); // Mount product routes

//   app.get('/', (req, res) => {
//     res.send('Welcome to the eCommerce web app!');
//   });

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// });
