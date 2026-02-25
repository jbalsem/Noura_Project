const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },

    // filtering
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ageMin: { type: Number, default: 0 },
    ageMax: { type: Number, default: 99 },

    // homepage sections
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);