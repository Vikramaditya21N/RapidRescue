const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function generateAuthenticationToken(user) {
  const payload = { 
    id: user.id, 
    name: user.name, 
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (request, response) => {
  try {
    const { name, email, phone, password, role } = request.body;

    const missingRequiredFields = !name || !email || !phone || !password;
    if (missingRequiredFields) {
      return response.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return response.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      id: Date.now(),
      name: name, 
      email: email.toLowerCase(), 
      phone: phone, 
      password: hashedPassword,
      role: role || 'patient'
    });

    await newUser.save();

    const token = generateAuthenticationToken(newUser);

    response.status(201).json({
      message: 'Registration successful!',
      token: token,
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone 
      }
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error during registration.' });
  }
});

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;

    const missingRequiredFields = !email || !password;
    if (missingRequiredFields) {
      return response.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return response.status(404).json({ error: 'No account found with this email.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return response.status(401).json({ error: 'Incorrect password.' });
    }

    const token = generateAuthenticationToken(user);

    response.json({
      message: 'Login successful!',
      token: token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        phone: user.phone 
      }
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;
