// room/route.js
import { Router } from "express";
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
} from "./controller.js";
import { verifyToken } from "../common/authmiddleware.js";
import requireRole from "../common/rolemiddleware.js";


const router = Router();

//
// Owner(사업자)용
// /api/room/owner...
//

// 특정 호텔의 객실 목록
router.get("/owner/hotel/:hotelId", verifyToken, getRoomsByHotel);

// 객실 생성
router.post("/owner/:hotelId", verifyToken, createRoom);

// 객실 수정
router.patch("/owner/:roomId", verifyToken, updateRoom);

// 객실 삭제
router.delete("/owner/:roomId", verifyToken, deleteRoom);

export default router;
