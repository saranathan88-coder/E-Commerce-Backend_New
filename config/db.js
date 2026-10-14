const mongoose = require("mongoose");

const connectDB = async() =>{
    try
    {
        await mongoose.connect(process.env.MONGO_ATLAS_URL);
        // await mongoose.connect(process.env.MONGO_COMPASS_URL);
        console.log("Database Connected");
    }
    catch(error)
    {
        console.log("Database Error :", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;