const bcrypt = require("bcrypt");
const User = require("../models/User");

function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    // Find the user by email in the database
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

          // Passwords match, user is authenticated
          resolve(user);
        });
      })
      .catch((error) => {
        reject("Failed to process login request");
      });
  });
}

module.exports = loginUser;
