// Register, Login, JWT
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwtHelper");

exports.register = async (req, res) => {
  try {
    const { name, email,phone, password,role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({
        message: "User already exists"
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
       token: generateToken(user._id),
       success: true,
       message: "Registered successfully",
       data: user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      return res.json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id),

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        
      });
    }

    res.status(401).json({
      message: "Invalid credentials"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
