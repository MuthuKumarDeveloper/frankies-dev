const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Add more customer details as needed
});

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["New", "Confirmed", "Cancelled"],
      default: "New",
    },
    customer: { type: customerSchema, required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    paymentInfo: {
      paymentMethod: { type: String, required: true },
      transactionId: { type: String },
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
