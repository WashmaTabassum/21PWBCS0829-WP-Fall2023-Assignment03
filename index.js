const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const app = express();
app.use(express.json());

 const uri = 'mongodb://127.0.0.1:27017/My_Ecommerce'; 
mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
  console.log('Database connected successfully');

  app.use('/', authRoutes); // Mounting user authentication routes
  app.use('/', adminRoutes); // Mounting admin authentication routes
  app.use('/', productRoutes);//Mounting products routes
  // Home page route
  app.get('/', (req, res) => {
    res.send('Welcome to the eCommerce web app!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});




