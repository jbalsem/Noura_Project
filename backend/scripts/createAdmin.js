require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function run() {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) throw new Error("Missing MONGO_URI in .env");

  await mongoose.connect(MONGO);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: "admin", firstName: "Admin" });

  console.log("✅ Admin created:", email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});