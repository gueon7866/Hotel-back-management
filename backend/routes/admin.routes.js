// backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.use(auth, requireRole("ADMIN"));

// 승인 대기 호텔 목록
router.get("/hotels/pending", adminController.getPendingHotels);

// 승인
router.patch("/hotels/:hotelId/approve", adminController.approveHotel);

// 반려
router.patch("/hotels/:hotelId/reject", adminController.rejectHotel);

module.exports = router;
