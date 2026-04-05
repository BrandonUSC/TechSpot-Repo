const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the Database");
    } catch (error) {
        console.log("Connection to the Database Failed!");
        process.exit();
    }
};
module.exports = connectDB;