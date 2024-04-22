const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios'); // Make sure to require axios
const Cart = require('./model');

const app = express();
app.use(bodyParser.json());

// MongoDB connection string
mongoose.connect('mongodb+srv://prabhasreddy-57:mongodb@prabhas.hoyjryn.mongodb.net/?retryWrites=true&w=majority&appName=prabhas'||'mongodb://localhost/cartService', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function getProductDetails(productId) {
  try {
    const response = await axios.get(`http://localhost:3002/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

// Add item to cart
app.post('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  // Validate the product before adding to cart
  const productDetails = await getProductDetails(productId);
  if (!productDetails) {
    return res.status(404).send('Product not found');
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      let itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        // If the product exists in the cart, update the quantity
        let item = cart.items[itemIndex];
        item.quantity += quantity;
        cart.items[itemIndex] = item;
      } else {
        // If the product does not exist in the cart, add new item
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get cart items with product details
app.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    const itemsWithDetails = await Promise.all(
      cart.items.map(async item => {
        const productDetails = await getProductDetails(item.productId);
        return { ...item.toObject(), productDetails };
      })
    );

    res.status(200).send({ ...cart.toObject(), items: itemsWithDetails });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Remove item from cart
app.delete('/cart/:userId/items/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Cart service listening on port ${PORT}`);
});
