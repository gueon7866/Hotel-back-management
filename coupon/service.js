// coupon/service.js
import Coupon from "./model.js";

// 활성 쿠폰 목록 (Public)
export const getActiveCoupons = async () => {
  const now = new Date();
  return await Coupon.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  }).sort({ createdAt: -1 });
};

// 내가 만든 쿠폰 목록 (owner/admin)
export const getMyCoupons = async (creatorId) => {
  return await Coupon.find({ creator: creatorId }).sort({ createdAt: -1 });
};

// 쿠폰 생성
export const createCoupon = async (creatorId, data) => {
  const coupon = await Coupon.create({
    ...data,
    creator: creatorId,
  });
  return coupon;
};

// 쿠폰 수정
export const updateCoupon = async (creatorId, couponId, updates, isAdmin) => {
  const filter = { _id: couponId };
  if (!isAdmin) filter.creator = creatorId;

  const coupon = await Coupon.findOne(filter);
  if (!coupon) {
    const err = new Error("COUPON_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  const fields = [
    "name",
    "description",
    "discountType",
    "discountValue",
    "minAmount",
    "maxDiscount",
    "validFrom",
    "validUntil",
    "isActive",
    "usageLimit",
    "targetHotel",
  ];

  fields.forEach((f) => {
    if (updates[f] !== undefined) coupon[f] = updates[f];
  });

  return await coupon.save();
};

// 쿠폰 삭제
export const deleteCoupon = async (creatorId, couponId, isAdmin) => {
  const filter = { _id: couponId };
  if (!isAdmin) filter.creator = creatorId;

  const coupon = await Coupon.findOne(filter);
  if (!coupon) {
    const err = new Error("COUPON_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  await Coupon.deleteOne({ _id: coupon._id });
  return true;
};

// 쿠폰 코드 검증
export const verifyCoupon = async (code) => {
  const now = new Date();

  const coupon = await Coupon.findOne({
    code,
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  });

  if (!coupon) {
    const err = new Error("INVALID_COUPON");
    err.statusCode = 404;
    throw err;
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    const err = new Error("COUPON_LIMIT_EXCEEDED");
    err.statusCode = 400;
    throw err;
  }

  return coupon;
};
