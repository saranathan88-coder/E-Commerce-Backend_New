const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');  //to integrate frontend and backend (supporting middleware)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db')

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authenticationRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userProfileRoutes");
const addressRoutes = require("./routes/addressRoutes");
const uploads =require("./middleware/upload");


const path = require("path");

// ENV config
dotenv.config();

// Express APP
const app = express();

// DB connection
connectDB();

app.use(express.json());
app.use(cors());

// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

// Admin view dashboard
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(process.env.PORT, () => {
//     console.log("Server is connected");
// })