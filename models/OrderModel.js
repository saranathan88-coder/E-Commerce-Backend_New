const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
            type: Number,
            required: true,
            min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
        },
    status: {
        type: String,
        enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
        ],
        default: "Pending"
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
