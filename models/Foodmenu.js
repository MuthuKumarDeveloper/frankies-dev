const mongoose = require('mongoose');

const foodMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const FoodMenu = mongoose.model('foodmenu', foodMenuSchema);

module.exports = FoodMenu;