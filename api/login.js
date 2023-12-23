const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const secretKey = process.env.JWT_SECRET;

function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return reject("Invalid email or password");
        }

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            return reject("Invalid email or password");
          }
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            secretKey
          );
          resolve({ user, token });
        });
      })
      .catch((error) => {
        reject("Failed to process login request");
      });
  });
}

module.exports = loginUser;
