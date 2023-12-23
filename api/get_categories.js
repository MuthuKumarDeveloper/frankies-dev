const Category = require("../models/Category");

async function getAllCategories() {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories from the database");
  }
}

module.exports = getAllCategories;
