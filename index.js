const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('./models/userSchema.js');
const authRoutes = require('./routes/authRoutes.js');

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
  // Mounting the authentication routes only after successful DB connection
  app.use('/', authRoutes);

  // Home page route
  app.get('/', (req, res) => {
    res.send('Welcome to the eCommerce web app!');
    // Alternatively, you can send HTML content:
    // res.send('<h1>Welcome to the eCommerce web app!</h1>');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

