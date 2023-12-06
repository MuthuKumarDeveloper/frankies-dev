const User = require("../models/User");

// Function to update a user's profile in the database by userId
async function updateUserProfile(userId, updatedProfile) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedProfile, {
      new: true,
    });

    // If the user is not found, return null
    if (!updatedUser) {
      return null;
    }

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user profile in the database");
  }
}

module.exports = { updateUserProfile };
