const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Transporter үүсгэх
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: `Зээлийн Апп <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    // Email илгээх
    await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Email илгээхэд алдаа гарлаа:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;