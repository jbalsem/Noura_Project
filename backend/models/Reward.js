const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  user: String,
  points: Number
});

module.exports = mongoose.model("Reward", RewardSchema);