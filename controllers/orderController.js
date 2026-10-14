// Order management

const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    const productIds = products.map(
      item => item.product
    );

    const dbProducts = await Product.find({
      _id: { $in: productIds }
    });

    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({
        message: "One or more products not found"
      });
    }

    let totalAmount = 0;

    for (const item of products) {
      const product = dbProducts.find(
        p => p._id.toString() === item.product
      );
      
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);

    const orders = await Order.find({
      user: req.user._id
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    console.log("Orders found:", orders);

    res.status(200).json(orders);

  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Update orders
exports.updateOrder = async (req, res) => {
  try {
    const { products } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const productIds = products.map(
      item => item.product
    );

    const dbProducts = await Product.find({
      _id: { $in: productIds }
    });

    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({
        message: "One or more products not found"
      });
    }

    let totalAmount = 0;

    for (const item of products) {
      const product = dbProducts.find(
        p => p._id.toString() === item.product
      );

      totalAmount += product.price * item.quantity;
    }

    order.products = products;
    order.totalAmount = totalAmount;

    await order.save();

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update order status (users only)
exports.ConfirmOrderStatus = async (req, res) => {
 try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "Confirmed";

    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product");

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
