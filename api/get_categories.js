const Category = require("../models/Category");

async function getAllCategories() {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories from the database");
  }
}

async function addCategory(categoryData) {
  try {
    const newCategory = new Category(categoryData);
    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw new Error("Error adding category to the database");
  }
}

async function deleteCategory(categoryId) {
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      throw new Error("Category not found");
    }
    return deletedCategory;
  } catch (error) {
    throw new Error("Error deleting category from the database");
  }
}

async function editCategory(categoryId, updatedCategoryData) {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedCategoryData,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory;
  } catch (error) {
    throw new Error("Error editing category in the database");
  }
}

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategory,
  editCategory,
};
