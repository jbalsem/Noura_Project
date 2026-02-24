const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

const upload = require("../middleware/upload");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Public: get categories
router.get("/", async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json(categories);
});

// Admin: create category (with image)
router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  const { name, slug } = req.body;

  const cat = await Category.create({
    name,
    slug,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    isActive: true,
  });

  res.json(cat);
});

module.exports = router;