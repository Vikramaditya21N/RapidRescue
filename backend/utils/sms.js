const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

function getClient() {
  return twilio(accountSid, authToken);
}

// Automatically cleans and formats phone numbers (defaults to +91 if 10-digits are provided)
function formatPhoneNumber(phone) {
  if (!phone) return phone;
  // Remove all non-digit, non-plus characters (e.g. spaces, dashes, brackets)
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

// Sends OTP to a phone number (Bypassed for easy presentation / demo purposes)
async function sendOtp(phone) {
  console.log(`[SMS] [Bypass Mode] OTP sent to ${phone}. You can enter any 6-digit code (e.g. 123456) to proceed.`);
}

// Verifies the OTP code entered by the user (Bypassed - always returns true)
async function verifyOtp(phone, code) {
  console.log(`[SMS] [Bypass Mode] Verification request for ${phone} with code ${code} - automatically approved.`);
  return true;
}

module.exports = { sendOtp, verifyOtp };
