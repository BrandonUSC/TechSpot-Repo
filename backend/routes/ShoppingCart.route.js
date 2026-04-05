const express = require("express");
const router = express.Router();

// Import controller functions

const {
  viewCart,
  addProduct,
  removeFromCart,
  calculateCostPerProduct,
  saveSession,
  goToCheckout
} = require("../controllers/ShoppingCart.controller");

// All routes related to the model ShoppingCart
router.get("/:userId", viewCart);
router.post("/:userId/add", addProduct);
router.post("/:userId/remove", removeFromCart);
router.get("/:userId/cost", calculateCostPerProduct);
router.post("/:userId/session", saveSession);
router.get("/:userId/checkout", goToCheckout);

module.exports = router;