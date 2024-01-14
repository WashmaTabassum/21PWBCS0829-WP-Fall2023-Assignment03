const express = require('express');
const Product = require('../models/productSchema');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const router = express.Router();

// Get all products
router.get('/allproducts',adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addproducts', adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  const { productId, name, description, price, imageUrl } = req.body;
  
  try {
    const existingProduct = await Product.findOne({ productId });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product with the same productId already exists.' });
    }
    const newProduct = new Product({ productId, name, description, price, imageUrl });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a product end-point
router.put('/products/:id', adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { productId, name, description, price, imageUrl } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productId, name, description, price, imageUrl },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product end-point
router.delete('/products/:id', adminAuthMiddleware.authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted', deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;

