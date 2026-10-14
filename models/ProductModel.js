const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
      type: String,
      unique: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        type: String,
      },
    ],
    specifications: {
      material: String,
      weight: String,
      dimensions: String,
      warranty: String,
      manufacturer: String,
      countryOfOrigin: String,
    },
    reviews: [reviewSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);



// {
//   "name": "Nike Air Max 270",
//   "description": "Comfortable running shoes with breathable mesh.",
//   "brand": "Nike",
//   "category": "Footwear",
//   "subCategory": "Running Shoes",
//   "price": 7999,
//   "discountPrice": 6999,
//   "stock": 30,
//   "sku": "NK-AM270-BLK-42",
//   "images": [
//     "shoe1.jpg",
//     "shoe2.jpg",
//     "shoe3.jpg"
//   ],
//   "colors": ["Black", "White", "Blue"],
//   "sizes": ["7", "8", "9", "10"],
//   "specifications": {
//     "material": "Mesh",
//     "weight": "800g",
//     "dimensions": "30 x 20 x 12 cm",
//     "warranty": "6 Months",
//     "manufacturer": "Nike India",
//     "countryOfOrigin": "India"
//   },
//   "averageRating": 4.6,
//   "totalRatings": 124,
//   "isFeatured": true,
//   "isActive": true
// }
