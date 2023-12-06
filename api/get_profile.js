const User = require("../models/User");

// Function to fetch a user's profile from the database by userId
async function getUserProfile(userId) {
  try {
    const userProfile = await User.findById(userId);

    // If the user is not found, return null
    if (!userProfile) {
      return null;
    }

    const sanitizedUserProfile = {
      _id: userProfile._id,
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      status: userProfile.status,
    };

    return sanitizedUserProfile;
  } catch (error) {
    throw new Error("Error fetching user profile from the database");
  }
}

module.exports = getUserProfile;
