const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO = "mongodb+srv://kidooze_user:NouraAli2026@cluster0.td7vamp.mongodb.net/toystore?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGO);

  const email = "admin@kidooze.com";
  const password = "Admin12345";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: "admin", firstName: "Admin" });

  console.log("✅ Admin created");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });