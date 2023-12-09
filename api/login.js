const bcrypt = require("bcrypt");
const User = require("../models/User");
const twilio = require("twilio");
require("dotenv").config();
const otpGenerator = require("otp-generator");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

function generateOTP() {
  return otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
}

async function sendOTPSMS(phoneNumber, otp) {
  const formattedPhoneNumber = `+91${String(phoneNumber).replace(/\D/g, "")}`;

  try {
    // Create a verification check
    const verificationCheck = await client.verify.v2
    .services("MGf8e56e767466ee7f9d76eca71aba9dcb")
    .verificationChecks.create({
      to: formattedPhoneNumber,
      code: otp,
    });

    // Check if the verification check was successful
    if (verificationCheck.status !== "approved") {
      throw new Error(`Invalid 'To' Phone Number: ${formattedPhoneNumber}`);
    }

    // Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your OTP for login is: ${otp}`,
      from: twilioPhoneNumber,
      to: formattedPhoneNumber,
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

async function loginUser(email, password, useOTP, providedOTP) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (useOTP) {
      if (providedOTP) {
        // Verify provided OTP
        if (
          user.otp &&
          user.otp.code === providedOTP &&
          user.otp.expiresAt > new Date()
        ) {
          // Clear OTP data after successful verification
          user.otp = undefined;
          await user.save();

          return "OTP verified successfully";
        } else {
          throw new Error("Invalid OTP or expired");
        }
      } else {
        // Generate and send OTP
        const otp = generateOTP();

        // Store OTP and its expiration time in the user's record in the database
        user.otp = {
          code: otp,
          expiresAt: new Date(Date.now() + OTP_EXPIRATION_TIME),
        };

        await user.save();

        // Send OTP via Twilio SMS
        await sendOTPSMS(user?.phone, otp);

        return "OTP sent successfully";
      }
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }

      return user;
    }
  } catch (error) {
    console.error("Error processing login request:", error);
    throw new Error(`Failed to process login request: ${error.message}`);
  }
}

module.exports = loginUser;
