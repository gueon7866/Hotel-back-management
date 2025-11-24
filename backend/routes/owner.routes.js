// backend/routes/owner.routes.js
import express from "express";
import * as ownerController from "../controllers/owner.controller.js";
import auth from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";

const router = express.Router();

// 모든 owner 전용 라우트에 인증 + owner 권한 적용
router.use(auth, requireRole("owner"));

// 내 호텔 목록
// GET /api/owner/hotels
router.get("/hotels", ownerController.getMyHotels);

// 호텔 생성 (등록 요청 -> status: pending)
// POST /api/owner/hotels
router.post("/hotels", ownerController.createHotel);

// 호텔 수정
// PATCH /api/owner/hotels/:hotelId
router.patch("/hotels/:hotelId", ownerController.updateHotel);

// 객실 생성
// POST /api/owner/hotels/:hotelId/rooms
router.post("/hotels/:hotelId/rooms", ownerController.createRoom);

// 객실 수정
// PATCH /api/owner/rooms/:roomId
router.patch("/rooms/:roomId", ownerController.updateRoom);

// 객실 삭제
// DELETE /api/owner/rooms/:roomId
router.delete("/rooms/:roomId", ownerController.deleteRoom);

export default router;
