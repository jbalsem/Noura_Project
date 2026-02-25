const mongoose = require("mongoose");

const HeroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },  // "/uploads/hero/xxx.jpg"
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", HeroSlideSchema);