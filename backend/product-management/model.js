// Update your models.js to include an image URL in the product schema
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String, required: true } // Assuming image URL will be stored
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
