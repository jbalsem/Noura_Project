const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// NOTE: later we can protect with admin auth middleware




router.get("/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.patch("/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
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
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Revenue = delivered only
    const deliveredOrders = await Order.find({ status: "delivered" });

    const revenue = deliveredOrders.reduce(
      (sum, o) => sum + Number(o.pricing?.total || 0),
      0
    );

    const ordersSold = deliveredOrders.length;
    const totalOrders = await Order.countDocuments();

    // status breakdown
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = Object.fromEntries(statusAgg.map((x) => [x._id, x.count]));

    // popular products (by qty) from delivered
    const popularProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          qty: { $sum: "$items.qty" },
          revenue: {
            $sum: {
              $multiply: [
                { $ifNull: ["$items.finalPrice", "$items.price"] },
                "$items.qty",
              ],
            },
          },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 8 },
    ]);

    res.json({ revenue, ordersSold, totalOrders, statusCounts, popularProducts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load stats" });
  }
});


module.exports = router;