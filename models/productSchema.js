
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  productId: {
    type: String, 
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;


