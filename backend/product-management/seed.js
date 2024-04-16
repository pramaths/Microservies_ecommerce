const mongoose = require('mongoose');
const { Product } = require('./model'); // Adjust the path according to your structure
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/productManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const products = [
  // Add 10 products here
  { name: 'Product 1', description: 'Description 1', price: 16677, image: 'https://m.media-amazon.com/images/I/61nxQ62qglL._SX679_.jpg' },
  { name: 'Product 2', description: 'Description 2', price: 100000, image: 'https://m.media-amazon.com/images/I/511XEUioL6L._AC_UF1000,1000_QL80_FMwebp_.jpg' },
  // Continue for more products...
  { name: 'Redmi A2 (Sea Green, 2GB RAM, 64GB Storage)', description: `Processor: High performance MediaTek Helio G36,upto 2.2GHz; | Upto 4GB RAM including 2GB Virtual RAM | 64GB Storage
  Display: Large 16.5 cm HD+ display with Scratch resistant glass | 400nits peak brightness | 120Hz Touch sampling Rate
  Camera: 8MP Dual camera with Portrait mode | 5MP Front camera
  5000mAh(typ) battery with 10W charger in-box
  Expandable Storage to upto 1TB with Dedicated MicroSD card Slot | Dual SIM (nano+nano) dual standby (4G+4G)`, price: 5299, image: 'https://m.media-amazon.com/images/I/81bh6SxXQ+L._SX679_.jpghttps://m.media-amazon.com/images/I/81bh6SxXQ+L._SX679_.jpg' },
];

Product.create(products)
  .then(() => {
    console.log('Products seeded successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Product seeding error:', err);
    mongoose.connection.close();
  });
