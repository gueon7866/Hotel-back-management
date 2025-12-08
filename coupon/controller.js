// ⬇⬇ coupon/controller.js 전체를 이걸로 교체 ⬇⬇
import { successResponse, errorResponse } from "../common/response.js";
import {
  createCoupon,
  getCouponsForAdmin,
  deactivateCoupon,
  getCouponsForOwner,
} from "./service.js";

// ADMIN: 쿠폰 생성
export const postCouponAsAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const coupon = await createCoupon(req.body, adminId);

    return res
      .status(201)
      .json(successResponse(coupon, "COUPON_CREATED", 201));
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// ADMIN: 쿠폰 목록 조회
export const getCouponsAsAdmin = async (req, res) => {
  try {
    const {
      ownerId,
      businessNumber, // 🔥 추가: 사업자번호로 필터 가능
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const data = await getCouponsForAdmin({
      ownerId,
      businessNumber,
      isActive,
      page,
      limit,
    });

    return res
      .status(200)
      .json(successResponse(data, "COUPON_ADMIN_LIST", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// ADMIN: 쿠폰 비활성화
export const deactivateCouponAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await deactivateCoupon(id);

    return res
      .status(200)
      .json(successResponse(coupon, "COUPON_DEACTIVATED", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// OWNER: 내 쿠폰 목록 조회 (토큰 기준 owner)
export const getCouponsAsOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const data = await getCouponsForOwner({
      ownerId,
      page,
      limit,
    });

    return res
      .status(200)
      .json(successResponse(data, "COUPON_OWNER_LIST", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};
// ⬆⬆ coupon/controller.js 전체 교체 끝 ⬆⬆
