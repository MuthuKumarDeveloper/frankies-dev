const Category = require("../models/Category");

// Function to get all categories
async function getAllCategories() {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories from the database");
  }
}

module.exports = getAllCategories;
