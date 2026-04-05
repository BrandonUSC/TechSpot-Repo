const express = require("express");
const router = express.Router();

// Import controller functions

const {
  registerUser,
  loginUser
} = require("../controllers/Users.controller");


// All routes related to the model User

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

module.exports = router;