// backend/config/db.js
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hotel";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("[DB] MongoDB connected"))
  .catch((err) => console.error("[DB] MongoDB connection error:", err));
