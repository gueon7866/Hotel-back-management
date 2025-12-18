// hotel/model.js
import mongoose from "mongoose";
import { dbConnection } from "../config/db.js";

export const FREEBIES = [
  "무료 와이파이",
  "무료 조식",
  "무료 주차",
  "공항 셔틀",
  "무료 취소",
];

export const AMENITIES = [
  "수영장",
  "스파",
  "피트니스",
  "바비큐 시설",
  "비즈니스 센터",
];

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },

    // 이 호텔의 소유자 (owner_db.User)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    images: {
      type: [String],
      default: [],
    },

    // ✅ 추가: 평점/혜택/편의시설
    // ratingOptions에서 5,4,3,2,1 같은 값(혹은 4.5 같은 숫자) 저장 가능
    rating: { type: Number, min: 1, max: 5, default: 0 },

    freebies: {
      type: [String],
      enum: FREEBIES,
      default: [],
    },

    amenities: {
      type: [String],
      enum: AMENITIES,
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ 핵심: 기본 mongoose.model 이 아니라 dbConnection.model 사용
export const Hotel = dbConnection.model("Hotel", hotelSchema);
export default Hotel;
