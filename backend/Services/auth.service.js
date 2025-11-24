// backend/services/auth.service.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerOwner = async (data) => {
  const { email, password, name, businessName, businessNumber } = data;

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("이미 존재하는 이메일입니다.");
    err.status = 400;
    throw err;
  }

 const user = await User.create({
  email,
  password,
  name,
  role: "owner",  // ✅ enum이랑 동일
  businessName,
  businessNumber,
});

  // 비밀번호 제거
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

export const validateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    err.status = 401;
    throw err;
  }

  const valid = await user.matchPassword(password);
  if (!valid) {
    const err = new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    err.status = 401;
    throw err;
  }

  return user;
};
