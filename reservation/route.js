// reservation/route.js
import { Router } from "express";
import {
  createReservation,
  getReservationDetail,
  getMyReservations,
  cancelReservation,
} from "./controller.js";
import { verifyToken } from "../common/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, createReservation);
router.get("/me", verifyToken, getMyReservations);
router.get("/:id", verifyToken, getReservationDetail);
router.patch("/:id/cancel", verifyToken, cancelReservation);

export default router;
