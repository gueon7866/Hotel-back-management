import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";

const router = express.Router();

// ADMIN 인증 미들웨어 적용 (소문자로!)
router.use(auth, requireRole("admin"));

// 승인 대기 호텔 목록
router.get("/hotels/pending", adminController.getPendingHotels);

// 승인
router.patch("/hotels/:hotelId/approve", adminController.approveHotel);

// 반려
router.patch("/hotels/:hotelId/reject", adminController.rejectHotel);

export default router;
