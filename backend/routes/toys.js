const express = require("express");
const Toy = require("../models/Toy");
const router = express.Router();

router.get("/", async (req, res) => {
  const toys = await Toy.find();
  res.json(toys);
});

router.post("/", async (req, res) => {
  const toy = new Toy(req.body);
  await toy.save();
  res.json(toy);
});

module.exports = router;