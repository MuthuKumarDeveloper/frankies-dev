// OTP Utils
const User = require("../models/User");

const sendOTP = (email) => {
  return new Promise((resolve, reject) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in the database
    // Assuming you have a User model
    User.findOneAndUpdate({ email }, { otp }, { new: true })
      .then((user) => {
        // Send OTP to user via email or SMS
        // For simplicity, let's assume it's a console.log statement
        console.log(`OTP sent to ${email}: ${otp}`);

        resolve(otp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { sendOTP };
