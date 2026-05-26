const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendDispatchEmail } = require('../utils/mailer');
const { sendOtp, verifyOtp } = require('../utils/sms');

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

// [POST] Send OTP for registration
router.post('/send-otp', async (request, response) => {
  try {
    const { phone } = request.body;

    if (!phone) {
      return response.status(400).json({ error: 'Phone number is required.' });
    }

    await sendOtp(phone);
    response.json({ message: 'OTP sent successfully to your mobile number.' });

  } catch (error) {
    console.error('[/send-otp]', error.message);
    response.status(500).json({ error: 'Failed to send OTP. Please check the phone number and try again.' });
  }
});

// [POST] Register a new user (verifies OTP via Twilio Verify)
router.post('/register', async (request, response) => {
  try {
    const { name, email, phone, password, role, otp } = request.body;

    if (!name || !email || !phone || !password || !otp) {
      return response.status(400).json({ error: 'All fields including OTP are required.' });
    }

    // Verify OTP with Twilio
    const isOtpValid = await verifyOtp(phone, otp);
    if (!isOtpValid) {
      return response.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return response.status(409).json({ error: 'Email already registered.' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return response.status(409).json({ error: 'Phone number already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || 'patient'
    });

    await newUser.save();

    const token = generateAuthenticationToken(newUser);

    response.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone
      }
    });

  } catch (error) {
    console.error('[/register]', error.message);
    response.status(500).json({ error: 'Server error during registration.' });
  }
});

// [POST] Send OTP for login
router.post('/send-login-otp', async (request, response) => {
  try {
    const { phone } = request.body;

    if (!phone) {
      return response.status(400).json({ error: 'Mobile number is required.' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return response.status(404).json({ error: 'No account found with this mobile number.' });
    }

    await sendOtp(phone);
    response.json({ message: 'OTP sent successfully via SMS.' });

  } catch (error) {
    console.error('[/send-login-otp]', error.message);
    response.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// [POST] Login with OTP (verifies OTP via Twilio Verify)
router.post('/login-with-otp', async (request, response) => {
  try {
    const { phone, otp } = request.body;

    if (!phone || !otp) {
      return response.status(400).json({ error: 'Mobile number and OTP are required.' });
    }

    // Verify OTP with Twilio
    const isOtpValid = await verifyOtp(phone, otp);
    if (!isOtpValid) {
      return response.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return response.status(404).json({ error: 'No account found with this mobile number.' });
    }

    const token = generateAuthenticationToken(user);

    response.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('[/login-with-otp]', error.message);
    response.status(500).json({ error: 'Server error during OTP login.' });
  }
});

module.exports = router;
