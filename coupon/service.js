// ⬇⬇ coupon/service.js 전체를 이걸로 교체 ⬇⬇
import Coupon from "./model.js";
import User from "../user/model.js";

// ADMIN: 쿠폰 생성
export const createCoupon = async (data, adminId) => {
  const {
    name,
    code,
    discountAmount,
    minOrderAmount,
    validFrom,
    validTo,
    ownerId,
  } = data;

  if (!name || !code || discountAmount == null || !validFrom || !validTo || !ownerId) {
    const err = new Error("COUPON_REQUIRED_FIELDS");
    err.statusCode = 400;
    throw err;
  }

  // ownerId가 실제 owner인지 확인 (선택이지만 안전하게)
  const owner = await User.findById(ownerId);
  if (!owner) {
    const err = new Error("OWNER_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }
  if (owner.role !== "owner") {
    const err = new Error("USER_IS_NOT_OWNER");
    err.statusCode = 400;
    throw err;
  }

  // 코드 중복 체크
  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    const err = new Error("COUPON_CODE_DUPLICATED");
    err.statusCode = 400;
    throw err;
  }

  const coupon = await Coupon.create({
    name,
    code: code.toUpperCase(),
    discountAmount,
    minOrderAmount: minOrderAmount || 0,
    validFrom,
    validTo,
    owner: ownerId,
    createdBy: adminId,
  });

  return coupon;
};

// ADMIN: 쿠폰 목록 조회 (필터 + 페이징)
export const getCouponsForAdmin = async ({
  ownerId,
  isActive,
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  if (ownerId) {
    filter.owner = ownerId;
  }
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const skip = (pageNumber - 1) * limitNumber;

  const total = await Coupon.countDocuments(filter);

  const items = await Coupon.find(filter)
    .populate("owner", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  return {
    items,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
  };
};

// ADMIN: 쿠폰 비활성화
export const deactivateCoupon = async (couponId) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    const err = new Error("COUPON_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  if (!coupon.isActive) {
    const err = new Error("COUPON_ALREADY_INACTIVE");
    err.statusCode = 400;
    throw err;
  }

  coupon.isActive = false;
  await coupon.save();

  return coupon;
};

// OWNER: 내 쿠폰 목록 조회 (활성 + 기간 내)
export const getCouponsForOwner = async ({
  ownerId,
  page = 1,
  limit = 20,
}) => {
  const now = new Date();

  const filter = {
    owner: ownerId,
    isActive: true,
    validFrom: { $lte: now },
    validTo: { $gte: now },
  };

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const skip = (pageNumber - 1) * limitNumber;

  const total = await Coupon.countDocuments(filter);

  const items = await Coupon.find(filter)
    .sort({ validTo: 1 }) // 곧 만료될 순서로
    .skip(skip)
    .limit(limitNumber);

  return {
    items,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
  };
};
// ⬆⬆ coupon/service.js 전체 교체 끝 ⬆⬆
