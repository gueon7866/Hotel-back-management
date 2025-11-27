// favorite/route.js
import { Router } from "express";
import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} from "./controller.js";
import { verifyToken } from "../common/authMiddleware.js";

const router = Router();

router.get("/me", verifyToken, getMyFavorites);
router.post("/", verifyToken, addFavorite);
router.delete("/", verifyToken, removeFavorite);
router.post("/toggle", verifyToken, toggleFavorite);

export default router;
