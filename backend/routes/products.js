// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ POST new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
