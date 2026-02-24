const express = require("express");
const Location = require("../models/Location");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: list locations
router.get("/", async (req, res) => {
  const locations = await Location.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(locations);
});

// Admin: create
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const loc = await Location.create({
    name: req.body.name,
    address1: req.body.address1,
    address2: req.body.address2 || "",
    city: req.body.city,
    state: req.body.state || "",
    zip: req.body.zip || "",
    phone: req.body.phone || "",
    hours: req.body.hours || "",
    mapUrl: req.body.mapUrl || "",
    isActive: true,
  });
  res.json(loc);
});

// Admin: update
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const loc = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(loc);
});

// Admin: delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;