// coupon/route.js
import { Router } from "express";
import {
  getActiveCoupons,
  getMyCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  verifyCoupon,
} from "./controller.js";
import { verifyToken } from "../common/authmiddleware.js";
import requireRole from "../common/rolemiddleware.js";


const router = Router();

// Public
router.get("/", getActiveCoupons);

// owner/admin만 생성 & 관리
router.get("/my", verifyToken, requireRole("owner", "admin"), getMyCoupons);
router.post("/", verifyToken, requireRole("owner", "admin"), createCoupon);
router.put("/:id", verifyToken, requireRole("owner", "admin"), updateCoupon);
router.delete("/:id", verifyToken, requireRole("owner", "admin"), deleteCoupon);

// 쿠폰 검증 (로그인 필요)
router.get("/verify/:code", verifyToken, verifyCoupon);

export default router;
