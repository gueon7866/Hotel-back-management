// backend/middlewares/role.middleware.js

export default function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }
    next();
  };
}
