// hotel/route.js
import { Router } from "express";
import {
  getMyHotels,
  createHotel,
  updateHotel,
  getPendingHotels,
  approveHotel,
  rejectHotel,
} from "./controller.js";
import { verifyToken } from "../common/authmiddleware.js";
import requireRole from "../common/rolemiddleware.js";


const router = Router();

//
// OWNER(사업자) 전용 라우트
// base: /api/hotel
//

// 내 호텔 목록
router.get("/owner", verifyToken, requireRole("owner"), getMyHotels);

// 호텔 생성
router.post("/owner", verifyToken, requireRole("owner"), createHotel);

// 호텔 수정
router.patch(
  "/owner/:hotelId",
  verifyToken,
  requireRole("owner"),
  updateHotel
);

//
// ADMIN 전용 라우트
//

// 승인 대기 호텔 목록
router.get(
  "/admin/pending",
  verifyToken,
  requireRole("admin"),
  getPendingHotels
);

// ADMIN: 호텔 승인
router.patch(
  "/admin/:hotelId/approve",
  verifyToken,
  requireRole("admin"),
  approveHotel
);

// ADMIN: 호텔 반려
router.patch(
  "/admin/:hotelId/reject",
  verifyToken,
  requireRole("admin"),
  rejectHotel
);

export default router;
