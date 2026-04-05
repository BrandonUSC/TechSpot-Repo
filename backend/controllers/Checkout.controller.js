const Checkout = require("../models/Checkout.model");
const ShoppingCart = require("../models/ShoppingCart.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

// CREATE SUMMARY - returns the cart items and total cost before the user confirms purchase
const createSummary = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await ShoppingCart.findOne({ userID: userId }).populate("products.productID");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate cost for each item and the overall total
    let total = 0;
    const items = cart.products.map(item => {
      const cost = item.quantity * item.productID.productCost;
      total += cost;
      return { productID: item.productID, quantity: item.quantity, cost };
    });

    res.status(200).json({ items, totalAmount: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PURCHASE ITEMS - processes the checkout, creates an order, and clears the cart
const purchaseItems = async (req, res) => {
  const { userId } = req.params;
  const {
    customerFirstName,
    customerSurname,
    customerEmail,
    phoneNumber,
    customerAddress,
    customerZipCode,
    paymentMethod,
    deliveryFee = 0
  } = req.body;

  try {
    const cart = await ShoppingCart.findOne({ userID: userId }).populate("products.productID");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check all products are still available and have enough stock
    for (const item of cart.products) {
      const product = item.productID;
      if (!product || product.productStatus !== "Available") {
        return res.status(400).json({ message: `"${product?.productName}" is no longer available` });
      }
      if (product.productQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.productName}". Only ${product.productQuantity} left.`
        });
      }
    }

    // Calculate total including delivery fee
    let total = 0;
    cart.products.forEach(item => total += item.quantity * item.productID.productCost);
    total += Number(deliveryFee);

    // Save checkout details to the database
    const checkout = await Checkout.create({
      user: userId,
      shoppingCart: cart._id,
      customerFirstName,
      customerSurname,
      customerEmail,
      phoneNumber,
      customerAddress,
      customerZipCode,
      paymentMethod,
      deliveryFee,
      totalAmount: total
    });

    // Create the order with a snapshot of items at time of purchase
    const order = await Order.create({
      userID: userId,
      shoppingCartID: cart._id,
      checkoutID: checkout._id,
      orderStatus: "Placed",
      timeOrdered: new Date(),
      items: cart.products.map(item => ({
        productID: item.productID._id,
        productName: item.productID.productName,
        productCost: item.productID.productCost,
        quantity: item.quantity
      }))
    });

    // Deduct stock for each product purchased
    await Promise.all(cart.products.map(async (item) => {
      const updated = await Product.findByIdAndUpdate(
        item.productID._id,
        { $inc: { productQuantity: -item.quantity } },
        { new: true }
      );
      // Auto mark as OutOfStock if quantity hits 0
      if (updated && updated.productQuantity <= 0) {
        updated.productStatus = "OutOfStock";
        await updated.save();
      }
    }));

    // Clear the cart after successful purchase
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Purchase successful", checkout, order });
  } catch (error) {
    console.error("purchaseItems error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSummary, purchaseItems };