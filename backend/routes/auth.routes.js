// backend/routes/auth.routes.js
import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

// 사업자 회원가입
router.post("/owner/register", authController.registerOwner);

// 로그인 (OWNER, ADMIN 공통)
router.post("/login", authController.login);

export default router;
