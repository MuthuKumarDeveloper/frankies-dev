const User = require("../models/User");

async function addUser(user) {
  try {
    const newUser = new User(user);
    await newUser.save();
  } catch (error) {
    console.error("Failed to add user:", error);
  }
}

module.exports = addUser;
