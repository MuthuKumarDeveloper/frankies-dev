const User = require('../models/User'); // Assuming you have a User model defined

async function deleteUser(userId) {
  try {
    await User.findByIdAndDelete(userId);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
}

module.exports = deleteUser;