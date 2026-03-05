require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function run() {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) throw new Error("Missing MONGO_URI in .env");

  await mongoose.connect(MONGO);

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await User.findOneAndUpdate(
    { role: "admin" },
    { email, passwordHash, role: "admin", firstName: "Admin" },
    { upsert: true, new: true }
  );

  console.log("✅ Admin ready:", admin.email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});