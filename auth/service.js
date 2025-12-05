// auth/service.js
import jwt from "jsonwebtoken";
import { User } from "../user/model.js";
import bcrypt from "bcryptjs";          // ✅ 추가

const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  process.env.JWT_SECRET ||
  "dev-secret";

// 로그인
export const login = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.status = 400;
    throw error;
  }

  // 이메일로 유저 찾기
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("INVALID_CREDENTIALS");
    error.status = 401;
    throw error;
  }

  // ✅ 인스턴스 메서드 대신 bcrypt.compare 직접 사용
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("INVALID_CREDENTIALS");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

// 회원가입
export const register = async (userData) => {
  if (!userData.email || !userData.password || !userData.name) {
    const error = new Error("Name, email, and password are required.");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error("USER_ALREADY_EXISTS");
    error.status = 409;
    throw error;
  }

  // 비밀번호 해시는 user/model.js의 pre('save') 훅에서 처리
  const user = await User.create(userData);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};
