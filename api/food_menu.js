const FoodMenu = require("../models/Foodmenu");

// Add Food Menu
async function addFoodMenu(name, description, price) {
  try {
    const newFoodMenu = new FoodMenu({
      name,
      description,
      price,
    });

    const savedFoodMenu = await newFoodMenu.save();

    return savedFoodMenu;
  } catch (error) {
    throw new Error("Failed to add food menu item");
  }
}

// Update Food Menu
async function updateFoodMenu(foodMenuId, name, description, price, isActive) {
  try {
    const foodMenu = await FoodMenu.findById(foodMenuId);
    if (!foodMenu) {
      throw new Error("Food menu item not found");
    }

    foodMenu.name = name;
    foodMenu.description = description;
    foodMenu.price = price;
    foodMenu.isActive = isActive;

    const updatedFoodMenu = await foodMenu.save();

    return updatedFoodMenu;
  } catch (error) {
    throw new Error("Failed to update food menu item");
  }
}

// Delete Food Menu
async function deleteFoodMenu(foodMenuId) {
  try {
    const deletedFoodMenu = await FoodMenu.findByIdAndRemove(foodMenuId);

    if (!deletedFoodMenu) {
      throw new Error("Food menu item not found");
    }

    return deletedFoodMenu;
  } catch (error) {
    throw new Error("Failed to delete food menu item");
  }
}

// Active/InActive Food Menu
async function updateFoodMenuStatus(foodMenuId, isActive) {
  try {
    const foodMenu = await FoodMenu.findById(foodMenuId);
    if (!foodMenu) {
      throw new Error("Food menu item not found");
    }

    foodMenu.isActive = isActive;

    const updatedFoodMenu = await foodMenu.save();

    return updatedFoodMenu;
  } catch (error) {
    throw new Error("Failed to update food menu item status");
  }
}

//get all food menu items
async function getAllFoodMenuItems() {
  try {
    // Fetch all food menu items from the database
    const foodMenuItems = await FoodMenu.find();
    return foodMenuItems;
  } catch (error) {
    throw new Error("Error fetching food menu items from the database");
  }
}

module.exports = {
  addFoodMenu,
  updateFoodMenu,
  deleteFoodMenu,
  updateFoodMenuStatus,
  getAllFoodMenuItems,
};
