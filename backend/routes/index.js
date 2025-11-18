// backend/routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const ownerRoutes = require("./owner.routes");
const adminRoutes = require("./admin.routes");
const uploadRoutes = require("./upload.routes");

router.get("/health", (req, res) => {
  res.json({ success: true, message: "OK from hotel-back-management" });
});

router.use("/auth", authRoutes);
router.use("/owner", ownerRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
