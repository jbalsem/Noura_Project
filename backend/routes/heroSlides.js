const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const HeroSlide = require("../models/HeroSlide");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// uploads/hero folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads", "hero");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/i.test(file.mimetype);
    cb(ok ? null : new Error("Only jpg/png/webp allowed"), ok);
  },
});

// ✅ Public: active slides for Home hero
router.get("/", async (req, res) => {
  const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.json(slides);
});

// ✅ Admin: list ALL slides (active + inactive)
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
  res.json(slides);
});

// ✅ Admin: upload one slide (FormData: image, order)
router.post("/upload", requireAuth, requireAdmin, upload.single("image"), async (req, res) => {
  const order = Number(req.body.order || 0);
  const slide = await HeroSlide.create({
    image: `/uploads/hero/${req.file.filename}`,
    order,
    active: true,
  });
  res.json(slide);
});

// ✅ Admin: toggle active
router.patch("/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Not found" });
  slide.active = !slide.active;
  await slide.save();
  res.json(slide);
});

// ✅ Admin: update order
router.patch("/:id/order", requireAuth, requireAdmin, async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Not found" });
  slide.order = Number(req.body.order ?? slide.order);
  await slide.save();
  res.json(slide);
});

// ✅ Admin: delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Not found" });

  // try delete file
  const absolute = path.join(__dirname, "..", slide.image.replace("/uploads/", "uploads/"));
  try { fs.unlinkSync(absolute); } catch (e) {}

  await slide.deleteOne();
  res.json({ ok: true });
});

module.exports = router;