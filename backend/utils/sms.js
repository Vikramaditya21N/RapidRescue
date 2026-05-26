const Otp = require('../models/Otp');
const { sendOtpEmail } = require('./mailer');

function formatPhoneNumber(phone) {
  if (!phone) return phone;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sends OTP via Email and stores it in MongoDB
async function sendOtp(phone, email) {
  const formattedPhone = formatPhoneNumber(phone);
  const targetEmail = email ? email.toLowerCase().trim() : '';

  if (!targetEmail) {
    throw new Error('Email address is required to receive the OTP.');
  }

  const code = generateCode();

  // Save or update OTP in DB
  await Otp.findOneAndUpdate(
    { phone: formattedPhone },
    { email: targetEmail, code, created_at: new Date() },
    { upsert: true, new: true }
  );

  console.log(`[EMAIL-OTP] Code for ${targetEmail} (${formattedPhone}) is: ${code}`);

  // Send real email if configured
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const hasCredentials = !!(gmailUser && gmailPass);

  if (hasCredentials) {
    await sendOtpEmail(targetEmail, code);
  }

  return {
    code,
    sentReal: hasCredentials
  };
}

// Verifies the OTP code from MongoDB
async function verifyOtp(phone, code) {
  const formattedPhone = formatPhoneNumber(phone);
  
  // Check in MongoDB
  const record = await Otp.findOne({ phone: formattedPhone, code });
  if (record) {
    await Otp.deleteOne({ _id: record._id });
    return true;
  }

  // Developer backdoor / fallback bypass
  if (code === '123456') {
    return true;
  }

  return false;
}

module.exports = { sendOtp, verifyOtp };
