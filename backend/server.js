const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

// ✅ Route setup
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const productRoutes = require('./routes/products');  // ✅ Add this
app.use('/api/products', productRoutes);             // ✅ And this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
