

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const cookieParser = require("cookie-parser");


console.log("🔥 THIS SERVER FILE IS RUNNING 🔥");

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
    credentials: true
  }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/toys", require("./routes/toys"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

app.use("/api/categories", require("./routes/categories"));
app.use("/api/locations", require("./routes/locations"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/settings", require("./routes/settings"));

app.use("/api/orders", require("./routes/orders"));

app.use("/api/admin", require("./routes/admin"));

mongoose
  .connect(
    "mongodb+srv://kidooze_user:NouraAli2026@cluster0.td7vamp.mongodb.net/toystore?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));



const PORT = 5050;



app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);