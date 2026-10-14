const Address = require("../models/addressModel");

// Add Address
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country,
      addressType,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // If new address is default,
    // remove default from old addresses
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country: country || "India",
      addressType: addressType || "Home",
      isDefault: isDefault || false,
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      message: "Failed to get addresses",
    });
  }
};

// Get Single Address
const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country,
      addressType,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        country,
        addressType,
        isDefault,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Set Default Address
const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        $set: { isDefault: true },
      },
      {
        new: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Default address updated",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};