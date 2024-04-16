// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Payment = require('./model');
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
console.log(process.env.MONGODB_URI)

// MongoDB connection string
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/paymentService', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log(process.env.MONGODB_URI)
// Process payment
app.post('/payment', async (req, res) => {
  const { userId, orderId, amount } = req.body;
  try {
    // Simulate payment processing
    const payment = new Payment({
      userId,
      orderId,
      amount,
      status: 'Successful' // Assume payment is always successful for this mock
    });
    await payment.save();
    res.status(200).send({ message: 'Payment processed successfully', payment });
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Payment service listening on port ${PORT}`);
});
