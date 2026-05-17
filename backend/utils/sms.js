const twilio = require('twilio');

async function sendSms(to, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!accountSid || !authToken || (!fromNumber && !messagingServiceSid)) {
    console.error("⚠️ TWILIO CREDENTIALS MISSING: To send a real SMS, add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID to your .env file.");
    console.log(`[SIMULATED SMS to ${to}]: ${message}`);
    return;
  }

  const client = twilio(accountSid, authToken);
  
  try {
    const messagePayload = {
      body: message,
      to: to
    };

    if (messagingServiceSid) {
      messagePayload.messagingServiceSid = messagingServiceSid;
    } else {
      messagePayload.from = fromNumber;
    }

    const response = await client.messages.create(messagePayload);
    console.log(`SMS sent successfully to ${to}. Message SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("Failed to send SMS via Twilio:", error);
    throw error;
  }
}

module.exports = { sendSms };
