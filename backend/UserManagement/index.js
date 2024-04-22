const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://prabhasreddy-57:mongodb@prabhas.hoyjryn.mongodb.net/?retryWrites=true&w=majority&appName=prabhas'||'mongodb://localhost:27017/userManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
   id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
let currentUserId = 0;
const User = mongoose.model('User', UserSchema);
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body)
    if (!username || !email || !password) {
      return res.status(400).send({ error: 'Username, email, and password are required' });
    }
    currentUserId++;

    const user = new User({ id: currentUserId, username, email, password });
    await user.save();
    res.status(201).send({ message: 'User created successfully', user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: 'Username or email already exists' });
    }
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ 
      $or: [{ username: login }, { email: login.toLowerCase() }] 
    });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    res.send({ message: 'Login successful', user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

const port = 3004;
app.listen(port, () => {
  console.log(`User management service listening on port ${port}`);
});
