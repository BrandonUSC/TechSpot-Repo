const mongoose = require("mongoose");

// Schema for storing a user's shopping cart
const ShoppingCartSchema = mongoose.Schema({

  // The user this cart belongs to (optional for guest carts)
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  // List of products in the cart with their quantities
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],

  // Session ID for guest cart tracking
  sessionID: {
    type: String,
    required: false
  }

}, { timestamps: true });

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);
module.exports = ShoppingCart;