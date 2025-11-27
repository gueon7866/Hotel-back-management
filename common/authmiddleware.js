// common/authmiddleware.js
import jwt from "jsonwebtoken";
import { errorResponse } from "./response.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(errorResponse("인증 토큰이 없습니다.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json(errorResponse("유효하지 않은 토큰입니다.", 401));
  }
}

export default verifyToken;
