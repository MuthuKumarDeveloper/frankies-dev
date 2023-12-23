const Order = require("../models/Order");

// Order Confirm API
async function confirmOrder(orderId) {
  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update the status to "Confirmed"
    order.status = "Confirmed";
    await order.save();

    return order;
  } catch (error) {
    throw new Error("Failed to confirm order");
  }
}

// Order Cancel API
async function cancelOrder(orderId) {
  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update the status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    return order;
  } catch (error) {
    throw new Error("Failed to cancel order");
  }
}

// Get order details by orderId
async function getOrderDetails(orderId) {
  try {
    // Fetch order details from the database by orderId
    const order = await Order.findOne({ orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error fetching order details from the database");
  }
}

async function placeOrder(orderData) {
  try {
    const orderId = generateOrderId();

    // Create a new order object
    const newOrder = new Order({
      orderId,
      status: "New",
      customer: orderData.customer,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      paymentInfo: orderData.paymentInfo,
      deliveryAddress: orderData.deliveryAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    return savedOrder;
  } catch (error) {
    throw new Error("Failed to place order");
  }
}

function generateOrderId() {
  const prefix = "ORD";
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const random = Math.random().toString(36).slice(2, 8); // Generate a random 6-character string

  return `${prefix}-${timestamp}-${random}`;
}

module.exports = {
  confirmOrder,
  cancelOrder,
  getOrderDetails,
  placeOrder,
};
