// utils/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Change if using a different provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



export const sendReminderEmail = async (to, subject, text) => {
  console.log(`Attempting to send reminder email to: ${to}`);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent! Info:', info.response);
  } catch (err) {
    console.error('Error sending reminder email:', err);
  }
};