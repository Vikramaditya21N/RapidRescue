const nodemailer = require('nodemailer');

// For your final project demo, this uses a completely free, fake SMTP service called Ethereal.
// It will print a URL to your terminal where you can see the email exactly as it would look in a real inbox!
// If you want to use REAL Gmail, replace host, port, auth with:
// service: 'gmail', auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }

async function sendDispatchEmail(patientEmail, patientName, bookingId, eta) {
  if (!patientEmail) return;

  try {
    // Generate a test account automatically
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: '"Rapid Rescue Dispatch" <dispatch@rapidrescue.com>',
      to: patientEmail,
      subject: `🚑 Ambulance Dispatched! Booking #${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Ambulance Dispatched</h1>
          </div>
          <div style="padding: 20px; background-color: #f8fafc;">
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Your Rapid Rescue ambulance has been assigned by our provider and is now en route to your location.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
              <p style="margin: 5px 0;"><strong>Estimated Arrival:</strong> ${eta}</p>
              <p style="margin: 5px 0;"><strong>Paramedic:</strong> Ravi Kumar</p>
            </div>

            <p style="text-align: center;">
              <a href="http://localhost:5500/track.html?id=${bookingId}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Live on Map</a>
            </p>
            
            <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center;">
              This is an automated message from Rapid Rescue. For emergencies, please stay calm and wait for the paramedics.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("-----------------------------------------");
    console.log("✉️  EMAIL SENT SUCCESSFULLY!");
    console.log("To view the email, click this link:");
    console.log(nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendDispatchEmail };
