const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    shippingFee: { type: Number, default: 5 },
    taxPercent: { type: Number, default: 8 }, // percent (8 = 8%)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);