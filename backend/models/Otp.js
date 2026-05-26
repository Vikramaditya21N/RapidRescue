const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  code: { type: String, required: true },
  created_at: { type: Date, default: Date.now, expires: 600 } // auto-expires in 10 minutes
});

module.exports = mongoose.model('Otp', otpSchema);
