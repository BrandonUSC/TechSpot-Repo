const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const ShoppingCart = require("../models/ShoppingCart.model");
const Checkout = require("../models/Checkout.model");

// Determine what the order status should be based on time elapsed
const getDesiredStatus = (order) => {
  if (order.orderStatus === "Cancelled") return "Cancelled";

  const elapsed = Date.now() - new Date(order.timeOrdered).getTime();

  if (elapsed < 60000) return "Placed";       // Within 1 minute - can still be cancelled
  return "Pickup at Store";                    // After 1 minute - ready for pickup
};

// Sync the order status in the database if it has changed
const syncOrderStatus = async (order) => {
  if (!order) return null;
  if (order.orderStatus === "Cancelled") return order;

  const desiredStatus = getDesiredStatus(order);

  if (order.orderStatus !== desiredStatus) {
    order.orderStatus = desiredStatus;
    await order.save();
  }

  return order;
};

// CREATE ORDER - places a new order from the user's cart and checkout info
const createOrder = async (req, res) => {
  try {
    const { userID, shoppingCartID, checkoutID } = req.body;

    // Validate required fields
    if (!userID || !shoppingCartID || !checkoutID) {
      return res.status(400).json({ message: "userID, shoppingCartID, and checkoutID are required" });
    }

    // Check checkout record exists
    const checkout = await Checkout.findById(checkoutID);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout record not found" });
    }

    // Get cart with product details
    const cart = await ShoppingCart.findById(shoppingCartID).populate("products.productID");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    // Check all products are available and have enough stock
    for (const item of cart.products) {
      const product = item.productID;

      if (!product) {
        return res.status(400).json({ message: "One or more products no longer exist" });
      }

      if (product.productStatus !== "Available") {
        return res.status(400).json({ message: `"${product.productName}" is no longer available` });
      }

      if (product.productQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.productName}". Only ${product.productQuantity} left.`
        });
      }
    }

    // Create the order with a snapshot of items
    const order = await Order.create({
      userID,
      shoppingCartID,
      checkoutID,
      orderStatus: "Placed",
      items: cart.products.map(item => ({
        productID: item.productID._id,
        productName: item.productID.productName,
        productCost: item.productID.productCost,
        quantity: item.quantity
      }))
    });

    // Deduct stock for each product ordered
    await Promise.all(
      cart.products.map(async (item) => {
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
      })
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};

// CANCEL ORDER - only allowed within 1 minute of placing the order
const cancelOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Sync status before checking if cancellation is allowed
    order = await syncOrderStatus(order);

    if (order.orderStatus !== "Placed") {
      return res.status(400).json({ message: "Only orders in Placed status can be cancelled" });
    }

    const cart = await ShoppingCart.findById(order.shoppingCartID);

    // Use order snapshot to restore stock, fall back to cart if snapshot is empty
    const itemsToRestore = (order.items && order.items.length > 0)
      ? order.items.map(item => ({ productID: item.productID, quantity: item.quantity }))
      : (cart && cart.products ? cart.products.map(item => ({ productID: item.productID, quantity: item.quantity })) : []);

    // Restore stock for each product
    if (itemsToRestore.length > 0) {
      await Promise.all(
        itemsToRestore.map(async (item) => {
          const updated = await Product.findByIdAndUpdate(
            item.productID,
            { $inc: { productQuantity: item.quantity } },
            { new: true }
          );

          // If product was OutOfStock, mark it Available again
          if (updated && updated.productQuantity > 0 && updated.productStatus === "OutOfStock") {
            updated.productStatus = "Available";
            await updated.save();
          }
        })
      );
    }

    // Mark order as cancelled
    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("cancelOrder error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ORDER SUMMARY - returns full order details including cart and checkout info
const getOrderSummary = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Sync status before returning
    await syncOrderStatus(order);

    // Re-fetch with populated references
    order = await Order.findById(req.params.id)
      .populate("shoppingCartID")
      .populate("checkoutID");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ORDERS BY USER - returns all orders placed by a specific user
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.params.userID })
      .populate("shoppingCartID")
      .populate("checkoutID")
      .sort({ createdAt: -1 }); // Newest orders first

    // Sync status for all orders
    await Promise.all(orders.map((order) => syncOrderStatus(order)));

    // Re-fetch updated orders
    const refreshedOrders = await Order.find({ userID: req.params.userID })
      .populate("shoppingCartID")
      .populate("checkoutID")
      .sort({ createdAt: -1 });

    res.status(200).json(refreshedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  cancelOrder,
  getOrderSummary,
  getOrdersByUser
};