const express = require("express");
const Settings = require("../models/Settings");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: get settings (for cart totals)
router.get("/", async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({ shippingFee: 5, taxPercent: 8 });
  res.json(s);
});

// Admin: update settings
router.put("/", requireAuth, requireAdmin, async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({ shippingFee: 5, taxPercent: 8 });

  s.shippingFee = Number(req.body.shippingFee ?? s.shippingFee);
  s.taxPercent = Number(req.body.taxPercent ?? s.taxPercent);

  await s.save();
  res.json(s);
});

module.exports = router;