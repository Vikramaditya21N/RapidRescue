const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/mailer');

const router = express.Router();

const otpCache = new Map(); // email -> OTP

function generateAuthenticationToken(user) {
  const payload = { 
    id: user.id, 
    name: user.name, 
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/send-otp', async (request, response) => {
  try {
    const { email } = request.body;
    
    if (!email) {
      return response.status(400).json({ error: 'Email is required to send OTP.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in memory for 10 minutes
    otpCache.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    await sendOtpEmail(email, otp);
    
    response.json({ message: 'OTP sent successfully to email.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while sending OTP.' });
  }
});

router.post('/register', async (request, response) => {
  try {
    const { name, email, phone, password, role, otp } = request.body;

    const missingRequiredFields = !name || !email || !phone || !password || !otp;
    if (missingRequiredFields) {
      return response.status(400).json({ error: 'All fields including OTP are required.' });
    }

    // Verify OTP
    const cachedOtpData = otpCache.get(email.toLowerCase());
    if (!cachedOtpData) {
      return response.status(400).json({ error: 'Please request an OTP first.' });
    }
    
    if (Date.now() > cachedOtpData.expiresAt) {
      otpCache.delete(email.toLowerCase());
      return response.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    
    if (cachedOtpData.otp !== otp) {
      return response.status(400).json({ error: 'Invalid OTP.' });
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
    
    // Clear OTP after successful registration
    otpCache.delete(email.toLowerCase());

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
