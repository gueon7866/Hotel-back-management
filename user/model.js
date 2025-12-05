// user/model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { dbConnection } from "../config/db.js";

const userSchema = new mongoose.Schema(
  {
    // 기본 정보
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // 항상 해시된 값으로 저장
    },
    phone: {
      type: String,
    },

    // 권한/상태
    role: {
      type: String,
      enum: ["owner", "admin"], // 필요하면 "superadmin" 등 추가 가능
      default: "owner",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 마지막 로그인 시간 등
    lastLoginAt: {
      type: Date,
    },
  },
  {
    // ❗❗ 실제 MongoDB 컬렉션 이름을 owner_users로 고정
    collection: "owner_users",
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 이메일 유니크 인덱스
userSchema.index({ email: 1 }, { unique: true });

// 비밀번호 해시 (회원가입/비번 변경 시)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// JSON으로 보낼 때 민감 정보 제거
userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

// 모델 이름은 그대로 "User" (나머지 코드 안 고쳐도 됨)
export const User = dbConnection.model("User", userSchema);
export default User;
