const mongoose = require("mongoose");

// Schema for storing checkout details when a user places an order
const CheckoutSchema = new mongoose.Schema({

  // The user who checked out (optional for guests)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  // The cart that was checked out
  shoppingCart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShoppingCart",
    required: true
  },

  // Customer contact and delivery details
  customerFirstName: { type: String, required: true },
  customerSurname: { type: String, required: true },
  customerEmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  phoneNumber: { type: String },
  customerZipCode: { type: String },
  customerAddress: { type: String, required: true },

  // Extra fee added for delivery
  deliveryFee: { type: Number, default: 0 },

  // Whether the customer checked out as a guest
  isGuest: { type: Boolean, default: true },

  // Final total including delivery fee
  totalAmount: { type: Number, required: true },

  // How the customer is paying or collecting their order
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "PickUp At Store"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Checkout", CheckoutSchema);