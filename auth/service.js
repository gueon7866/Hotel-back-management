// auth/service.js
import jwt from "jsonwebtoken";
import User from "../user/model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = "7d";

// OWNER 회원가입 (개발/관리자용)
export const registerOwnerService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("name, email, password 는 필수입니다.");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // ⚠ 여기서는 비밀번호를 그냥 평문으로 넣는다.
  // userSchema.pre("save") 훅에서 자동으로 해시됨.
  const user = await User.create({
    name,
    email,
    password,
    role: "owner",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// 로그인 (owner / admin 공통)
export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("email, password 는 필수입니다.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // ✅ 모델에 정의된 matchPassword 사용
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // 관리자/사업자만 로그인 허용
  if (!["owner", "admin"].includes(user.role)) {
    throw new Error("관리자/사업자 계정이 아닙니다.");
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
