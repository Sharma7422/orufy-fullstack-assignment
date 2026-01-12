const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      enum: ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"],
      required: true,
    },
    quantityStock: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    productImages: [
      {
        type: String, 
        required: true,
      },
    ],
    exchangeOrReturn: {
      type: Boolean,
      default: true,
    },
    publishedStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
