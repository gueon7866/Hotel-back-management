// auth/route.js
import { Router } from "express";
import { login, registerOwner } from "./controller.js";

const router = Router();

// 개발용: 사업자(OWNER) 회원가입
router.post("/register-owner", registerOwner);

// 공통 로그인 (owner / admin 모두 사용)
router.post("/login", login);

export default router;
