// backend/routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import ownerRoutes from "./owner.routes.js";
import adminRoutes from "./admin.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "OK from hotel-back-management" });
});

router.use("/auth", authRoutes);
router.use("/owner", ownerRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

export default router;
