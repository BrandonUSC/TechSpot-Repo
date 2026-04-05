const Product = require("../models/Product.model");

// CREATE PRODUCT - adds a new product to the database
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS - returns every product in the database
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCT - returns a single product by its ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCT ID - returns only the ID of a product
const getProductID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("_id");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ productID: product._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IS IN STOCK - returns the stock status of a product
const isInStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ inStock: product.productStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CATEGORY - returns the category of a product
const getCategory = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("productCategory");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ category: product.productCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AVAILABLE QUANTITY - returns how many units are available, accounting for items in active carts
const getAvailableQuantity = async (req, res) => {
  try {
    const ShoppingCart = require("../models/ShoppingCart.model");
    const mongoose = require("mongoose");

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productObjectId = new mongoose.Types.ObjectId(req.params.id);

    // Find all carts that contain this product
    const carts = await ShoppingCart.find({ "products.productID": productObjectId });

    // Count total quantity of this product across all carts
    let totalInCarts = 0;
    carts.forEach(cart => {
      const item = cart.products.find(i => i.productID.toString() === req.params.id);
      if (item) totalInCarts += item.quantity;
    });

    // Available = total stock minus what is reserved in carts
    const availableQuantity = Math.max(0, product.productQuantity - totalInCarts);

    res.status(200).json({
      totalQuantity: product.productQuantity,
      inCarts: totalInCarts,
      available: availableQuantity
    });
  } catch (error) {
    console.error("getAvailableQuantity error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProduct,
  getProductID,
  isInStock,
  getCategory,
  createProduct,
  getAllProducts,
  getAvailableQuantity
};