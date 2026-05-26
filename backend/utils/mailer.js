const nodemailer = require('nodemailer');

function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
  }

  // Fallback: log-only mode when Gmail credentials are not configured
  return null;
}

async function sendDispatchEmail(patientEmail, patientName, bookingId, eta) {
  if (!patientEmail) return;

  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';

  if (!transporter) {
    console.log(`[MAILER] Dispatch email to ${patientEmail} for booking ${bookingId} — configure GMAIL_USER and GMAIL_APP_PASSWORD in .env to enable real emails.`);
    return;
  }

  try {
    const mailOptions = {
      from: `"Rapid Rescue Dispatch" <${process.env.GMAIL_USER}>`,
      to: patientEmail,
      subject: `Ambulance Dispatched! Booking #${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Ambulance Dispatched</h1>
          </div>
          <div style="padding: 20px; background-color: #f8fafc;">
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Your Rapid Rescue ambulance has been assigned and is now en route to your location.</p>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
              <p style="margin: 5px 0;"><strong>Estimated Arrival:</strong> ${eta}</p>
            </div>
            <p style="text-align: center;">
              <a href="${frontendUrl}/track.html?id=${bookingId}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Live on Map</a>
            </p>
            <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center;">
              This is an automated message from Rapid Rescue. Please stay calm and wait for the paramedics.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Dispatch email sent to ${patientEmail} for booking ${bookingId}.`);
  } catch (error) {
    console.error('[MAILER] Error sending dispatch email:', error.message);
  }
}

async function sendOtpEmail(email, otp) {
  if (!email) return;

  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[MAILER] OTP email to ${email}: ${otp} — configure GMAIL_USER and GMAIL_APP_PASSWORD in .env to enable real emails.`);
    return;
  }

  try {
    const mailOptions = {
      from: `"Rapid Rescue Accounts" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your OTP for Rapid Rescue: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Verification Code</h1>
          </div>
          <div style="padding: 20px; background-color: #f8fafc; text-align: center;">
            <p>Your One-Time Password (OTP) for Rapid Rescue is:</p>
            <h2 style="font-size: 36px; letter-spacing: 5px; color: #333; background: #e2e8f0; padding: 10px; border-radius: 5px; display: inline-block;">${otp}</h2>
            <p style="color: #64748b; margin-top: 20px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] OTP email sent to ${email}.`);
  } catch (error) {
    console.error('[MAILER] Error sending OTP email:', error.message);
  }
}

module.exports = { sendDispatchEmail, sendOtpEmail };
