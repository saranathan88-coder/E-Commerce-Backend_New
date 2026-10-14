const express = require("express");

const {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add address
router.post("/", protect, addAddress);

// Get all addresses
router.get("/", protect, getAddresses);

// Get single address
router.get("/:id", protect, getAddress);

// Update address
router.put("/:id", protect, updateAddress);

// Delete address
router.delete("/:id", protect, deleteAddress);

// Set default address
router.patch("/:id/default", protect, setDefaultAddress);

module.exports = router;