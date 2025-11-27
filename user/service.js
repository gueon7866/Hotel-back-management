// user/service.js
import User from "./model.js";
import bcrypt from "bcryptjs";

// 내 프로필 조회
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("USER_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

// 내 프로필 수정
export const updateMe = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("USER_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  const fields = ["name", "phone"];
  fields.forEach((f) => {
    if (updates[f] !== undefined) user[f] = updates[f];
  });

  return await user.save();
};

// 비밀번호 변경
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("USER_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    const err = new Error("INVALID_CURRENT_PASSWORD");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  return await user.save();
};

// Admin: 유저 목록
export const getUsers = async (options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (options.role) filter.role = options.role;

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// Admin: 역할 변경 / 블락 토글
export const updateUserByAdmin = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("USER_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  const fields = ["role", "isBlocked"];
  fields.forEach((f) => {
    if (updates[f] !== undefined) user[f] = updates[f];
  });

  return await user.save();
};
