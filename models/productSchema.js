const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  brand: String,
  stock: {
    type: Number,
    default: 0
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
