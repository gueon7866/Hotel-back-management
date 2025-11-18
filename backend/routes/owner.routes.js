// backend/routes/owner.routes.js
const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/owner.controller");
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.use(auth, requireRole("OWNER"));

// 내 호텔 목록
router.get("/hotels", ownerController.getMyHotels);

// 호텔 생성 (등록 요청 -> PENDING)
router.post("/hotels", ownerController.createHotel);

// 호텔 수정
router.patch("/hotels/:hotelId", ownerController.updateHotel);

module.exports = router;
