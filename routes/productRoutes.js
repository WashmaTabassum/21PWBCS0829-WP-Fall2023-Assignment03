const express = require('express');
const Product = require('../models/productSchema');

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new product
router.post('/products', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  try {
    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product by ID
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product by ID
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted', deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

