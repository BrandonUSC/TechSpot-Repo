const mongoose = require("mongoose");

// Schema for storing order details after a purchase is made
const OrderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },           // User who placed the order
  shoppingCartID: { type: mongoose.Schema.Types.ObjectId, ref: "ShoppingCart", required: true }, // Cart used for the order
  checkoutID: { type: mongoose.Schema.Types.ObjectId, ref: "Checkout", required: true },   // Checkout record linked to the order

  // Current status of the order
  orderStatus: {
    type: String,
    enum: ["Placed", "Pickup at Store", "Cancelled"],
    default: "Placed"
  },

  timeOrdered: { type: Date, default: Date.now }, // Time the order was placed

  // Snapshot of items at the time of purchase (in case products change later)
  items: [
    {
      productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productName: String,
      productCost: Number,
      quantity: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);