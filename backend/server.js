const express = require('express');
const app = express();
const cors = require('cors');
 // Database connection function
const connectDB = require("./db/db");
 // Set DNS servers for Atlas connection
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8", "0.0.0.0"]);

// Run script "npm run start" to start the server

// Import all routes
const userRoute = require("./routes/Users.route");
const shoppingCartRoute = require("./routes/ShoppingCart.route");
const productRoute = require("./routes/Product.route");
const checkoutRoute = require("./routes/Checkout.route");
const orderRoute = require("./routes/Order.route");

// Port the server runs on
const PORT = 4000; 

// Middleware

// Allow requests from the frontend
app.use(cors({
  origin: 'https://tech-spot-repo-frontend.vercel.app'
}));   
// Parse incoming JSON request bodies    
app.use(express.json()); 

// Base route - confirms server is running
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API Routes
app.use("/api/users", userRoute);       
app.use("/api/cart", shoppingCartRoute); 
app.use("/api/products", productRoute);  
app.use("/api/checkout", checkoutRoute); 
app.use("/api/orders", orderRoute);      

// Connect to MongoDB then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});