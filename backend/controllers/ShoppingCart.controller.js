const ShoppingCart = require("../models/ShoppingCart.model");
const Product = require("../models/Product.model");

// VIEW CART - returns the user's cart with full product details
const viewCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({
      userID: req.params.userId
    }).populate("products.productID"); // Fill in product details

    // Return empty cart if none exists
    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD PRODUCT - adds a product to the user's cart or increases quantity if already there
const addProduct = async (req, res) => {
  const { productID, quantity } = req.body;

  try {
    // Check product exists and is available
    const product = await Product.findById(productID);

    if (!product || product.productStatus !== "Available") {
      return res.status(400).json({ message: "Product out of stock" });
    }

    // Find existing cart or create a new one
    let cart = await ShoppingCart.findOne({ userID: req.params.userId });

    if (!cart) {
      cart = await ShoppingCart.create({
        userID: req.params.userId,
        products: []
      });
    }

    // If product already in cart, increase quantity; otherwise add it
    const item = cart.products.find(p => p.productID.toString() === productID);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ productID, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE FROM CART - removes a specific product from the user's cart
const removeFromCart = async (req, res) => {
  const { productID } = req.body;

  try {
    const cart = await ShoppingCart.findOne({ userID: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the product to remove it
    cart.products = cart.products.filter(
      item => item.productID.toString() !== productID
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CALCULATE COST PER PRODUCT - returns cost breakdown for each item in the cart
const calculateCostPerProduct = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({
      userID: req.params.userId
    }).populate("products.productID");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate cost for each item (quantity x price)
    const breakdown = cart.products.map(item => ({
      productID: item.productID._id,
      quantity: item.quantity,
      cost: item.quantity * item.productID.productCost
    }));

    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SAVE SESSION - saves a session ID to the cart for guest tracking
const saveSession = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOneAndUpdate(
      { userID: req.params.userId },
      { sessionID: req.body.sessionID },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GO TO CHECKOUT - returns the cart contents ready for checkout
const goToCheckout = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({
      userID: req.params.userId
    }).populate("products.productID");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    res.status(200).json({
      message: "Proceeding to checkout",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewCart,
  addProduct,
  removeFromCart,
  calculateCostPerProduct,
  saveSession,
  goToCheckout
};