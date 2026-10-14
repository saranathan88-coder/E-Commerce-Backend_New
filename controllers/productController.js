// # Product CRUD & search
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const fs = require("fs");
const path = require("path");

exports.createProduct = async (req, res) => {
try {

    const images = req.files.map((file) => file.filename);

    const product = await Product.create({
        ...req.body,
        colors: JSON.parse(req.body.colors),
        sizes: JSON.parse(req.body.sizes),
        specifications: JSON.parse(req.body.specifications),
        images,
        // image: req.file ? req.file.filename : "",  //For single
    });
    
    res.status(201).json(product);
    } 
    catch (error) 
    {
        res.status(500).json({
        message: error.message
    });
    }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
    try {
    const products = await Product.find();

    res.json(products);
    console.log(products);
    } 
    catch (error) 
    {
        res.status(500).json({
        message: error.message
    });
    }
};

exports.getProduct = async (req, res) => {
    try
    {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({message: "Product not found"});
    }

    res.json(product);
    } 
    catch (error) 
    {
        res.status(500).json({
        message: error.message
    });
    }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    // Delete old images
    if (
      req.body.replaceImages === "true" &&
      req.files &&
      req.files.length > 0
    ) {
      product.images.forEach((img) => {
        const filePath = path.join(
          __dirname,
          "../uploads",
          img
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      product.images = req.files.map(
        (file) => file.filename
      );
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.subCategory = req.body.subCategory;
    product.price = req.body.price;
    product.discountPrice = req.body.discountPrice;
    product.stock = req.body.stock;
    product.sku = req.body.sku;

    product.colors = JSON.parse(req.body.colors);
    product.sizes = JSON.parse(req.body.sizes);
    product.specifications = JSON.parse(
      req.body.specifications
    );

    product.isFeatured = req.body.isFeatured === "true";
    product.isActive = req.body.isActive === "true";

    await product.save();

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({message: "Product not found"});
    }

    res.json({message: "Deleted successfully"});
  } 
  catch (error) {
    res.status(500).json({message: error.message});
  }
};

// Search Products
exports.searchProducts = async (req, res) => {
    let result = await Product.find();

    // Filter by category
    if (req.query.search) {
      const searchValue = req.query.search.toLowerCase();

      result = result.filter((item) =>
        item.name?.toLowerCase().includes(searchValue) ||
        item.category?.toLowerCase().includes(searchValue) ||
        item.subCategory?.toLowerCase().includes(searchValue)
      );
    }

    // A subcategory filter
    if (req.query.subCategory) {
      result = result.filter(
        (item) =>
          item.subCategory?.toLowerCase() ===
          req.query.subCategory.toLowerCase()
      );
    }

    // Filter by quantity
    if (req.query.stock) {
        result = result.filter(
            item => item.stock == req.query.stock
        );
    }

    // Search by item name
    if (req.query.search) {
        result = result.filter(item =>
            item.name
                .toLowerCase()
                .includes(req.query.search.toLowerCase())
        );
    }

    // Sort
    if (req.query.sort) {
        switch (req.query.sort) {
            case "name":
                result.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;

            case "price":
                result.sort((a, b) =>
                    a.price - b.price
                );
                break;

            case "stock":
                result.sort((a, b) =>
                    a.stock - b.stock
                );
                break;
        }
    }

    res.status(200).json({
        message: "Items fetched successfully",
        data: result
    });
};

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

    if (typeof comment !== "string" || !comment.trim()) {
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

    // Only customers with a delivered order can review.
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      status: "Delivered",
      "products.product": product._id,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "You can review this product only after delivery",
      });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    const alreadyReviewed = product.reviews.some(
      (review) =>
        review.user?.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name || "Customer",
      rating: numericRating,
      comment: comment.trim(),
    });

    product.totalRatings = product.reviews.length;

    product.averageRating =
      product.reviews.reduce(
        (sum, review) => sum + review.rating,
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

