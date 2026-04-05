const mongoose = require("mongoose");

// Schema for storing user account information
const UserSchema = mongoose.Schema({

  firstName: {
    type: String,
    required: [true, "This field is required"]
  },

  lastName: {
    type: String,
    required: [true, "This field is required"]
  },

  userName: {
    type: String,
    required: [true, "This field is required"]
  },

  // Stored as plain text - used for login authentication
  userPassword: {
    type: String,
    required: [true, "This field is required"]
  },

  // Must be unique and in valid email format
  userEmail: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;