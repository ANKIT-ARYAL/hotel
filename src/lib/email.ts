import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendBookingConfirmationEmail = async ({
  to,
  name,
  roomNumber,
  checkIn,
  checkOut,
  totalAmount,
}: {
  to: string;
  name: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}) => {
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email credentials not set. Skipping email automation.");
    return;
  }

  const inDate = new Date(checkIn).toLocaleDateString();
  const outDate = new Date(checkOut).toLocaleDateString();

  const mailOptions = {
    from: `"Hotel Booking" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject: `Your Booking is Confirmed! (Room ${roomNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #111;">Booking Confirmation</h2>
        <p>Hi ${name},</p>
        <p>Thank you for choosing us! Your booking has been successfully processed.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111;">Stay Details</h3>
          <p><strong>Room:</strong> ${roomNumber}</p>
          <p><strong>Check-In:</strong> ${inDate}</p>
          <p><strong>Check-Out:</strong> ${outDate}</p>
          <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        </div>

        <p>If you have any questions or need to make changes, please contact us.</p>
        <p>We look forward to hosting you!</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          &copy; ${new Date().getFullYear()} Our Hotel. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
