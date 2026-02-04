const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, message) => {
  try {
    // Монголын утасны дугаар болгох (+976)
    const phoneNumber = phone.startsWith('+976') ? phone : `+976${phone}`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return { success: true };
  } catch (error) {
    console.error('SMS илгээхэд алдаа гарлаа:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendSMS;