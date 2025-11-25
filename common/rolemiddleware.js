// backend/middlewares/role.middleware.js

export default function requireRole(...allowedRoles) {
  // 미들웨어 정의 시 넘겨준 allowedRoles를 전부 소문자로 변환
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    // 토큰에 들어있는 role도 소문자로 변환해서 비교
    const userRole = String(req.user.role).toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    next();
  };
}
