const express = require("express");
const router = express.Router();

// Import product controller functions
const {
  getProduct,
  getProductID,
  isInStock,
  getCategory,
  createProduct,
  getAllProducts,
  getAvailableQuantity,
} = require("../controllers/Product.controller");

// GET ALL PRODUCTS - must be defined before /:id routes to avoid conflict
router.get("/", getAllProducts);

// GET AVAILABLE QUANTITY - accounts for items currently in carts
router.get("/:id/available", getAvailableQuantity);

// GET PRODUCT DETAILS
router.get("/:id", getProduct);

// GET PRODUCT ID ONLY
router.get("/:id/id", getProductID);

// CHECK STOCK STATUS
router.get("/:id/stock", isInStock);

// GET PRODUCT CATEGORY
router.get("/:id/category", getCategory);

// CREATE NEW PRODUCT
router.post("/", createProduct);

module.exports = router;