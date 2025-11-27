// coupon/controller.js
import * as couponService from "./service.js";
import { successResponse, errorResponse } from "../common/response.js";

// GET /api/coupons
export const getActiveCoupons = async (_req, res) => {
  try {
    const coupons = await couponService.getActiveCoupons();
    return res
      .status(200)
      .json(successResponse(coupons, "COUPON_LIST", 200));
  } catch (err) {
    return res.status(400).json(errorResponse(err.message, 400));
  }
};

// GET /api/coupons/my
export const getMyCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getMyCoupons(req.user.id);
    return res
      .status(200)
      .json(successResponse(coupons, "MY_COUPONS", 200));
  } catch (err) {
    return res.status(400).json(errorResponse(err.message, 400));
  }
};

// POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.user.id, req.body);
    return res
      .status(201)
      .json(successResponse(coupon, "COUPON_CREATED", 201));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const coupon = await couponService.updateCoupon(
      req.user.id,
      req.params.id,
      req.body,
      isAdmin
    );
    return res
      .status(200)
      .json(successResponse(coupon, "COUPON_UPDATED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    await couponService.deleteCoupon(req.user.id, req.params.id, isAdmin);
    return res
      .status(200)
      .json(successResponse(null, "COUPON_DELETED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// GET /api/coupons/verify/:code
export const verifyCoupon = async (req, res) => {
  try {
    const coupon = await couponService.verifyCoupon(req.params.code);
    return res
      .status(200)
      .json(successResponse(coupon, "COUPON_VALID", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 404)
      .json(errorResponse(err.message, err.statusCode || 404));
  }
};
