const User = require("../models/Users.model");

// REGISTER - creates a new user account
const registerUser = async (req, res) => {
  const { firstName, lastName, userName, userEmail, userPassword } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save the new user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      userEmail,
      userPassword
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN - authenticates a user with email and password
const loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password matches
    if (userPassword !== user.userPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data on success
    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};