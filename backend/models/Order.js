const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      address: String,
      phone: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        finalPrice: Number,
        discountPercent: Number,
        qty: Number,
        image: String,
      },
    ],
    pricing: {
      subtotal: Number,
      shipping: Number,
      tax: Number,
      total: Number,
      taxPercent: Number,
    },
    status: {
        type: String,
        enum: ["received", "delivered", "returned", "canceled"],
        default: "received",
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);