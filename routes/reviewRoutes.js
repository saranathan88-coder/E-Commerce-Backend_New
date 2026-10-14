const express = require("express");
const router = express.Router();

const { addReview } = require("../controllers/ProductController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:productId/reviews", protect, addReview);

module.exports = router;