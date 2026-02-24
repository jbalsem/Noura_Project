const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function setTokenCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true only when using HTTPS in production
  });
}

// Register (for normal users)
router.post("/register", async (req, res) => {
  const { email, password, firstName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email and password required" });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ ok: false, message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    firstName: firstName || "",
    role: "user",
  });

  setTokenCookie(res, { id: user._id.toString(), role: user.role, email: user.email });
  res.json({ ok: true, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName } });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  setTokenCookie(res, { id: user._id.toString(), role: user.role, email: user.email });
  res.json({ ok: true, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName } });
});

// Me
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("email role firstName");
  res.json({ ok: true, user });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

module.exports = router;