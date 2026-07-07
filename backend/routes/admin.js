const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// 🔐 JWT Admin Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'password123';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.ADMIN_TOKEN_SECRET || 'secret', {
      expiresIn: '2h'
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ Auth middleware using Bearer token
const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  jwt.verify(token, process.env.ADMIN_TOKEN_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.admin = decoded;
    next();
  });
};

// 🔍 Optional logger middleware
router.use((req, res, next) => {
  console.log(`[ADMIN] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Add Product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    if (!name || !description || !price || !imageUrl || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newProduct = new Product({ name, description, price, imageUrl, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('[ERROR] Add Product:', err);
    res.status(500).json({ error: 'Server error while adding product.' });
  }
});

// ✏️ Edit Product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('[ERROR] Edit Product:', err);
    res.status(500).json({ error: 'Server error while updating product.' });
  }
});

// ❌ Delete Product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('[ERROR] Delete Product:', err);
    res.status(500).json({ error: 'Server error while deleting product.' });
  }
});

module.exports = router;
