const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const addUser = require("./api/add_user");
const updateUser = require("./api/update_user");
const deleteUser = require("./api/delete_user");
const loginUser = require("./api/login");
const getUserProfile = require("./api/get_profile");
const categoriesController = require("./api/get_categories");
const orderController = require("./api/order_controller");
const foodMenuController = require("./api/food_menu");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers
app.use(morgan("combined")); // Request logging

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.post("/api/users/create", (req, res) => {
  const user = req.body;
  user.status = "active";

  // Hash the password before saving it to the database
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add user" });
    }

    user.password = hashedPassword;

    // Save the user with the hashed password to the database
    addUser(user)
      .then(() => {
        res.status(201).json({ message: "User added successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to add user" });
      });
  });
});

app.put("/api/users/update/:id", (req, res) => {
  const user = req.body;
  const userId = req.params.id;
  updateUser(userId, user)
    .then(() => {
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update user" });
    });
});

app.delete("/api/users/delete/:id", (req, res) => {
  const userId = req.params.id;
  deleteUser(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete user" });
    });
});

// Login route
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginResult = await loginUser(email, password, true);

    if (loginResult === "OTP sent successfully") {
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(200).json({ message: "Login successful", data: loginResult });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// OTP verification route
app.post("/api/users/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const loginResult = await loginUser(email, null, true, otp);

    if (loginResult === "OTP verified successfully") {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Order Confirm API
app.put("/api/orders/confirm/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const confirmedOrder = await orderController.confirmOrder(orderId);
    res
      .status(200)
      .json({ message: "Order confirmed successfully", order: confirmedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Cancel API
app.put("/api/orders/cancel/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const cancelledOrder = await orderController.cancelOrder(orderId);
    res
      .status(200)
      .json({ message: "Order cancelled successfully", order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Placement API
app.post("/api/orders/place", async (req, res) => {
  const orderData = req.body;

  try {
    const savedOrder = await orderController.placeOrder(orderData);

    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get order details by orderId
app.get("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orderDetails = await orderController.getOrderDetails(orderId);

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(404).json({ error: "Order not found" });
  }
});

// Add Food Menu API
app.post("/api/foodMenus/add", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const savedFoodMenu = await foodMenuController.addFoodMenu(
      name,
      description,
      price,
      image
    );

    res.status(201).json({
      message: "Food menu item added successfully",
      foodMenu: savedFoodMenu,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Food Menu API
app.put("/api/foodMenus/update/:id", async (req, res) => {
  try {
    const foodMenuId = req.params.id;
    const { name, description, price, isActive } = req.body;

    const updatedFoodMenu = await foodMenuController.updateFoodMenu(
      foodMenuId,
      name,
      description,
      price,
      isActive
    );

    res.status(200).json({
      message: "Food menu item updated successfully",
      foodMenu: updatedFoodMenu,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Food Menu API
app.delete("/api/foodMenus/delete/:id", async (req, res) => {
  try {
    const foodMenuId = req.params.id;

    const deletedFoodMenu = await foodMenuController.deleteFoodMenu(foodMenuId);

    res.status(200).json({
      message: "Food menu item deleted successfully",
      foodMenu: deletedFoodMenu,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Active/InActive Food Menu API
app.put("/api/foodMenus/active/:id", async (req, res) => {
  try {
    const foodMenuId = req.params.id;
    const { isActive } = req.body;

    const updatedFoodMenu = await foodMenuController.updateFoodMenuStatus(
      foodMenuId,
      isActive
    );

    res.status(200).json({
      message: "Food menu item status updated successfully",
      foodMenu: updatedFoodMenu,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user's profile by their userId
app.get("/api/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get all categories
app.get("/api/categories", async (_req, res) => {
  console.log("Received GET request to /api/categories");
  try {
    const categories = await categoriesController.getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add a new category
app.post("/api/categories", async (req, res) => {
  try {
    const newCategory = await categoriesController.addCategory(req.body);

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Edit a category
app.put("/api/categories/:id", async (req, res) => {
  try {
    const updatedCategory = await categoriesController.editCategory(
      req.params.id,
      req.body
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to edit category" });
  }
});

// Delete a category
app.delete("/api/categories/:id", async (req, res) => {
  console.log(`Received DELETE request to /api/categories/${req.params.id}`);
  try {
    const deletedCategory = await categoriesController.deleteCategory(req.params.id);

    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Get all food menu items
app.get("/api/foodMenus", async (req, res) => {
  try {
    const foodMenuItems = await foodMenuController.getAllFoodMenuItems();

    res.status(200).json(foodMenuItems);
  } catch (error) {
    console.error("Error fetching food menu items:", error);
    res.status(500).json({ error: "Failed to fetch food menu items" });
  }
});

// 404 Not Found middleware
app.use((req, res) => {
  console.log(`404: Not Found - ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" });
});
