const express = require("express");
const router = express.Router();

// Import controller functions

const {
  createOrder,
  cancelOrder,
  getOrderSummary,
  getOrdersByUser
} = require("../controllers/Order.controller");

// All routes related to the model Order

router.post("/", createOrder);                    
router.get("/user/:userID", getOrdersByUser);     
router.get("/:id", getOrderSummary);
router.put("/:id/cancel", cancelOrder);          

module.exports = router;