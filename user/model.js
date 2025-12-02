// ⬇⬇ user/model.js 전체 교체 ⬇⬇
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { businessConnection } from "../config/db.js";

// 사업자/관리자용 User (owner_db)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "owner",
    },
    // 필요하면 여기에 추가 필드들...
  },
  { timestamps: true }
);

// 🔐 저장 전에 비밀번호 해시
userSchema.pre("save", async function (next) {
  // password 필드가 변경되지 않았으면 그냥 패스
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 로그인 시 비밀번호 비교 메서드
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 응답에서 비밀번호 제거 + id 변환
userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

// ✅ owner_db(businessConnection)에 User 저장
export const User = businessConnection.model("User", userSchema);
export default User;
// ⬆⬆ user/model.js 교체 끝 ⬆⬆
