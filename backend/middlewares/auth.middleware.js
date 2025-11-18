// backend/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "인증 토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
};
