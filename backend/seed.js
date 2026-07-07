const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();
console.log("Connecting to:", process.env.MONGO_URI);  // 🔍 Debug


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🌱 Seeding database...");
    
    await Product.deleteMany(); // Optional: Clears existing products

    await Product.insertMany([
      {
        name: "Silver Bracelet",
        description: "Elegant hand-crafted bracelet for special occasions.",
        price: 999,
        imageUrl: "https://placehold.co/200x150/ddd/333?text=Bracelet"
      },
      {
        name: "Gold Earrings",
        description: "Stylish gold-plated earrings with modern design.",
        price: 1499,
        imageUrl: "https://placehold.co/200x150/fcc/333?text=Earrings"
      },
      {
        name: "Chain Necklace",
        description: "Shiny chain necklace with a minimalist pendant.",
        price: 1899,
        imageUrl: "https://placehold.co/200x150/ffc/000?text=Necklace"
      }
    ]);

    console.log("✅ Products inserted successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit();
  });
