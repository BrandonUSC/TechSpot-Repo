const express = require("express");
const router = express.Router();

// Import controller functions

const {
  createSummary,
  purchaseItems
} = require("../controllers/Checkout.controller");

// All routes related to the model Checkout

// GET SUMMARY
router.get("/:userId/summary", createSummary);

// POST PURCHASE
router.post("/:userId/purchase", purchaseItems);

module.exports = router;