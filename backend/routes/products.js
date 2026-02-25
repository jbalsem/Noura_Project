
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const upload = require("../middleware/upload");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const mongoose = require("mongoose");

console.log("✅ products route registered");

router.get("/deals", async (req, res) => {
  const products = await Product.find({
    isActive: true,
    discountPercent: { $gt: 0 },
  }).sort({ createdAt: -1 });

  res.json(products);
});


// GET all products
router.get("/", async (req, res) => {
    const {
      categoryId,
      minPrice,
      maxPrice,
      age,
      section // "bestSeller" | "newArrival"
    } = req.query;
  
    const q = { isActive: true };
  
    if (categoryId) q.categoryId = new mongoose.Types.ObjectId(categoryId);
  
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }
  
    if (age) {
      const a = Number(age);
      q.ageMin = { $lte: a };
      q.ageMax = { $gte: a };
    }
  
    if (section === "bestSeller") q.isBestSeller = true;
    if (section === "newArrival") q.isNewArrival = true;
  
    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json(products);
  });

// CREATE product (admin later)
router.post("/", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description || "",
      image: req.file ? `/uploads/${req.file.filename}` : null,
  
      categoryId: req.body.categoryId,
      ageMin: Number(req.body.ageMin || 0),
      ageMax: Number(req.body.ageMax || 99),
  
      isBestSeller: req.body.isBestSeller === "true",
      isNewArrival: req.body.isNewArrival === "true",

      discountPercent: Number(req.body.discountPercent || 0),
  
      isActive: true
      
    });
  
    res.json(product);
  });
  

// UPDATE product
router.put("/:id", requireAuth, requireAdmin,async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// DELETE product
router.delete("/:id",  requireAuth, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});



module.exports = router;
