// coupon/service.js
import { User } from "../user/model.js";
import Coupon from "./model.js";

export const createCoupon = async (data, adminId) => {
  const {
    name,
    code,
    discountAmount,
    minOrderAmount,
    validFrom,
    validTo,
    businessNumber,      // 👈 사업자 번호로 받음
  } = data;

  if (!name || !code || discountAmount == null || !validFrom || !validTo || !businessNumber) {
    const err = new Error("COUPON_REQUIRED_FIELDS");
    err.statusCode = 400;
    throw err;
  }

  // 1) 사업자번호로 owner 찾기
  const owner = await User.findOne({ businessNumber });
  if (!owner) {
    const err = new Error("OWNER_NOT_FOUND_BY_BUSINESS_NUMBER");
    err.statusCode = 404;
    throw err;
  }

  // 2) 기존대로 ownerId(ObjectId) 기준으로 저장
  const coupon = await Coupon.create({
    name,
    code: code.toUpperCase(),
    discountAmount,
    minOrderAmount: minOrderAmount ?? 0,
    validFrom,
    validTo,
    ownerId: owner._id,             // 👈 여전히 ownerId 사용
    ownerBusinessNumber: businessNumber, // (선택) 편의를 위해 같이 저장
    isActive: true,
    createdBy: adminId,
  });

  return coupon;
};
