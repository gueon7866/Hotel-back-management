// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// 사업자 회원가입
router.post("/owner/register", authController.registerOwner);

// 로그인 (OWNER, ADMIN 공통)
router.post("/login", authController.login);

module.exports = router;
