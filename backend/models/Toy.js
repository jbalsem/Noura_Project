const mongoose = require("mongoose");

const ToySchema = new mongoose.Schema({
  name: String,
  price: Number
});

module.exports = mongoose.model("Toy", ToySchema);