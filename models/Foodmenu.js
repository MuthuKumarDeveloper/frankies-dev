const mongoose = require('mongoose');

const foodMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true }, // Indicates if the food item is active or inactive
}, { timestamps: true });

const FoodMenu = mongoose.model('foodmenu', foodMenuSchema);

module.exports = FoodMenu;