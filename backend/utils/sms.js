const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

function getClient() {
  return twilio(accountSid, authToken);
}

// Sends OTP to a phone number using Twilio Verify
async function sendOtp(phone) {
  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error('SMS service is not configured on the server.');
  }

  const client = getClient();
  await client.verify.v2.services(verifyServiceSid)
    .verifications
    .create({ to: phone, channel: 'sms' });

  console.log(`[SMS] OTP sent via Twilio Verify to ${phone}`);
}

// Verifies the OTP code entered by the user
async function verifyOtp(phone, code) {
  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error('SMS service is not configured on the server.');
  }

  const client = getClient();
  const result = await client.verify.v2.services(verifyServiceSid)
    .verificationChecks
    .create({ to: phone, code: code });

  return result.status === 'approved';
}

module.exports = { sendOtp, verifyOtp };
