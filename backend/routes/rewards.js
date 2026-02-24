const express = require("express");
const Reward = require("../models/Reward");
const router = express.Router();

router.get("/", async (req, res) => {
  const rewards = await Reward.find();
  res.json(rewards);
});

module.exports = router;