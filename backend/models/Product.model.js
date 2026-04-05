const mongoose = require("mongoose");

// Schema for storing product information
const ProductSchema = mongoose.Schema({

  // Product name
  productName: {
    type: String,
    required: [true, "Product name is required"]
  },

  // URL or path to the product image
  productImage: {
    type: String,
    required: false
  },

  // Price of the product
  productCost: {
    type: Number,
    required: [true, "Product cost is required"]
  },

  // Category the product belongs to
  productCategory: {
    type: String,
    enum: ["Laptops", "SmartPhones", "Accessories", "Desktops", "Speakers", "Hardware"],
    required: [true, "Product Category is required"]
  },

  // Whether the product is available, out of stock, or discontinued
  productStatus: {
    type: String,
    enum: ["Available", "OutOfStock", "Discontinued"],
    default: "OutOfStock"
  },

  // Short description of the product
  productDescription: {
    type: String
  },

  // How many units are in stock
  productQuantity: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;