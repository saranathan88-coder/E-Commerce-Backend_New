
const Product = require("../models/ProductModel");

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({
        message: "Please log in to submit a review",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Review comment is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check whether this product belongs to a delivered order
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      status: /^delivered$/i,
      "products.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "You can review this product only after delivery",
      });
    }

    // Prevent the same user from reviewing this product twice.
    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name || "",
      rating: numericRating,
      comment: comment.trim(),
    });

    product.totalRatings = product.reviews.length;

    product.averageRating =
      product.reviews.reduce(
        (total, review) => total + review.rating,
        0
      ) / product.totalRatings;

    await product.save();

    return res.status(201).json({
      message: "Review submitted successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    console.error("Add review error:", error);

    return res.status(500).json({
      message: "Failed to submit review",
      error: error.message,
    });
  }
};
