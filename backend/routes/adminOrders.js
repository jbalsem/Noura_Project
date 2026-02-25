const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET /api/admin/orders  (list all orders newest first)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load orders" });
  }
});

// PATCH /api/admin/orders/:id/status  (update status)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["received", "delivered", "returned", "canceled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update status" });
  }
});

// ✅ DELETE /api/admin/orders/:id  (delete an order)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;