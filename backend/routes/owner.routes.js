// backend/routes/owner.routes.js
import express from "express";
import * as ownerController from "../controllers/owner.controller.js";
import auth from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(auth, requireRole("OWNER"));

// 내 호텔 목록
router.get("/hotels", ownerController.getMyHotels);

// 호텔 생성 (등록 요청 -> PENDING)
router.post("/hotels", ownerController.createHotel);

// 호텔 수정
router.patch("/hotels/:hotelId", ownerController.updateHotel);

export default router;
