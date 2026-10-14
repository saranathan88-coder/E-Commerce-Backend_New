const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");

router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;