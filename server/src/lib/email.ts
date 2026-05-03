import nodemailer from "nodemailer";

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
}) => {
  // Create a transporter
  // Default to Ethereal for graduation project safety
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER || "testuser@ethereal.email", 
      pass: process.env.SMTP_PASS || "testpass",
    },
  });

  const mailOptions = {
    from: `"Hargeisa Events Pro" <${process.env.FROM_EMAIL || "no-reply@hargeisapro.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    // If using Ethereal, log the preview URL
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Email send failed:", error);
  }
};

export const getBookingConfirmationTemplate = (booking: any) => {
  return `
    <div style="font-family: 'Helvetica', sans-serif; padding: 40px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
        <div style="text-align: center; border-bottom: 2px solid #eeeeee; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: -1px; text-transform: uppercase;">Hargeisa Events Pro</h1>
          <p style="margin: 5px 0 0; font-size: 10px; font-weight: bold; color: #999999; letter-spacing: 2px;">STRICTLY PROFESSIONAL</p>
        </div>
        
        <h2 style="font-size: 20px; margin-top: 0;">BOOKING CONFIRMED</h2>
        <p>Hello <strong>${booking.clientName}</strong>,</p>
        <p>We are pleased to inform you that your request for <strong>${booking.venue?.name || "the venue"}</strong> has been officially confirmed by our management team.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 30px 0;">
          <p style="margin: 0 0 10px; font-size: 12px; color: #666666; text-transform: uppercase; font-weight: bold;">Reservation Details</p>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 5px 0; color: #888888;">Event Date:</td>
              <td style="padding: 5px 0; font-weight: bold;">${new Date(booking.eventDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #888888;">Guest Count:</td>
              <td style="padding: 5px 0; font-weight: bold;">${booking.guestCount} Guests</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #888888;">Booking ID:</td>
              <td style="padding: 5px 0; font-weight: bold; font-family: monospace;">${booking._id}</td>
            </tr>
          </table>
        </div>
        
        <p>Your financial ledger has been updated. Please log in to your dashboard to complete the deposit payment via Zaad or eDahab.</p>
        
        <div style="margin-top: 40px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Open Dashboard</a>
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 10px; color: #999999; text-align: center;">
          <p>© 2026 Hargeisa Events Pro. All rights reserved.</p>
          <p>Hargeisa, Somaliland</p>
        </div>
      </div>
    </div>
  `;
};
