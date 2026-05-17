const twilio = require('twilio');

async function sendSms(to, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error("⚠️ TWILIO CREDENTIALS MISSING: To send a real SMS, add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your .env file.");
    console.log(`[SIMULATED SMS to ${to}]: ${message}`);
    return;
  }

  const client = twilio(accountSid, authToken);
  
  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });
    console.log(`SMS sent successfully to ${to}. Message SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("Failed to send SMS via Twilio:", error);
    throw error;
  }
}

module.exports = { sendSms };
