const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
let twilioClient = null;

const Settings = require("../models/Settings"); // if you already have it
const Order = require("../models/Order");       // we add this model below

function money(n) {
  return Number(n).toFixed(2);
}

function buildSummary({ customer, items, pricing }) {
  const lines = [];
  lines.push("🧸 KIDOOZE - NEW ORDER");
  lines.push("");
  lines.push("👤 Customer:");
  lines.push(`- Name: ${customer.firstName} ${customer.lastName}`);
  lines.push(`- Email: ${customer.email}`);
  lines.push(`- Phone: ${customer.phone}`);
  lines.push(`- Address: ${customer.address}`);
  lines.push("");
  lines.push("🛒 Items:");
  items.forEach((it) => {
    const unit = Number(it.finalPrice ?? it.price ?? 0);
    lines.push(`- ${it.name} x${it.qty} = $${money(unit * it.qty)}`);
  });
  lines.push("");
  lines.push("💰 Totals:");
  lines.push(`- Subtotal: $${money(pricing.subtotal)}`);
  lines.push(`- Shipping: $${money(pricing.shipping)}`);
  lines.push(`- Tax: $${money(pricing.tax)} (${pricing.taxPercent}%)`);
  lines.push(`- Total: $${money(pricing.total)}`);
  return lines.join("\n");
}

function makeTransporter() {
  // Works great with Gmail App Passwords
  // Set env: EMAIL_USER, EMAIL_PASS
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function initTwilio() {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    const twilio = require("twilio");
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
}

router.post("/checkout", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing customer info or cart items." });
    }

    const required = ["firstName", "lastName", "email", "address", "phone"];
    for (const k of required) {
      if (!customer[k]) return res.status(400).json({ error: `Missing field: ${k}` });
    }

    // Load settings from DB (fallback to 0)
    let shippingFee = 0;
    let taxPercent = 0;

    try {
      const s = await Settings.findOne();
      if (s) {
        shippingFee = Number(s.shippingFee || 0);
        taxPercent = Number(s.taxPercent || 0);
      }
    } catch (e) {
      // if no Settings model or not seeded, keep zeros
    }

    const subtotal = items.reduce((sum, it) => {
      const unit = Number(it.finalPrice ?? it.price ?? 0);
      return sum + unit * Number(it.qty || 1);
    }, 0);

    const shipping = shippingFee;
    const tax = (subtotal * taxPercent) / 100;
    const total = subtotal + shipping + tax;

    const pricing = { subtotal, shipping, tax, total, taxPercent };

    // Save order (recommended)
    const order = await Order.create({
      customer,
      items,
      pricing,
      status: "pending",
    });

    const summaryText = buildSummary({ customer, items, pricing });

    // 1) Send WhatsApp to store number
    const toWhatsAppE164 = process.env.WHATSAPP_TO || "+12065521479";

    if (!twilioClient) twilioClient = initTwilio();

    let whatsappLink = null;

    if (
      twilioClient &&
      process.env.TWILIO_WHATSAPP_FROM // example: "whatsapp:+14155238886"
    ) {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${toWhatsAppE164}`,
        body: summaryText,
      });
    } else {
      // Fallback: generate a click-to-chat link for manual sending/opening
      const encoded = encodeURIComponent(summaryText);
      whatsappLink = `https://wa.me/${toWhatsAppE164.replace(/\D/g, "")}?text=${encoded}`;
    }

    // 2) Email the customer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = makeTransporter();
      await transporter.sendMail({
        from: `Kidooze <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: `Kidooze Order Confirmation (#${order._id})`,
        text:
          `Hi ${customer.firstName},\n\n` +
          `Thanks for your order! ✅\n\n` +
          `We received your order and will contact you via WhatsApp soon to confirm it.\n\n` +
          `Order summary:\n\n${summaryText}\n\n` +
          `— Kidooze`,
      });
    }

    return res.json({ ok: true, orderId: String(order._id), whatsappLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during checkout." });
  }
});

module.exports = router;