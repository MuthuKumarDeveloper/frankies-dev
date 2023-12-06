const User = require('../models/User'); // Assuming you have a User model defined

async function updateUser(userId, user) {
  try {
    await User.findByIdAndUpdate(userId, user);
    console.log('User updated successfully');
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

module.exports = updateUser;
