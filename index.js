const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addUser = require("./api/add_user");
const updateUser = require("./api/update_user");
const deleteUser = require("./api/delete_user");
const loginUser = require("./api/login");
const getUserProfile = require("./api/get_profile");
const getAllCategories = require("./api/get_categories");
const orderController = require("./api/order_controller");
const foodMenuController = require("./api/food_menu");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Create an Express app
const app = express();

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
mongoose
  .connect("mongodb://localhost:27017/frankies", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.use(express.json()); // Parse JSON request bodies

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
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user using the loginUser function
  loginUser(email, password)
    .then((user) => {
      res.status(200).json({ message: "Login successful", user });
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
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
    const { name, description, price } = req.body;

    const savedFoodMenu = await foodMenuController.addFoodMenu(
      name,
      description,
      price
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
    console.log("userProfile", userProfile);

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get all categories
app.get("/api/categories", async (_req, res) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
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
