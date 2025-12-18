// hotel/controller.js
import * as hotelService from "./service.js";
import Hotel from "./model.js";
import { successResponse, errorResponse } from "../common/response.js";

const parseArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [v];
    }
  }
  return [];
};

const parseRating = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

//
// OWNER (사업자)
//

// GET /api/hotel/owner
export const getMyHotels = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);

    const data = await hotelService.getHotelsByOwner(ownerId, { page, limit });

    return res.status(200).json(successResponse(data, "MY_HOTELS", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// POST /api/hotel/owner
export const createHotel = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;

    // S3 업로드된 이미지 URL
    const images = req.files?.map((file) => file.location) || [];

    // ✅ 추가 파싱
    const rating = parseRating(req.body.rating);
    const freebies = parseArray(req.body.freebies);
    const amenities = parseArray(req.body.amenities);

    const hotel = await hotelService.createHotel(ownerId, {
      ...req.body,
      images,
      rating,
      freebies,
      amenities,
    });

    return res
      .status(201)
      .json(successResponse(hotel, "HOTEL_CREATED_PENDING", 201));
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// PATCH /api/hotel/owner/:hotelId
export const updateHotel = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const { hotelId } = req.params;

    const payload = { ...req.body };

    if ("rating" in req.body) payload.rating = parseRating(req.body.rating);
    if ("freebies" in req.body) payload.freebies = parseArray(req.body.freebies);
    if ("amenities" in req.body) payload.amenities = parseArray(req.body.amenities);

    const hotel = await hotelService.updateHotel(ownerId, hotelId, payload);

    return res.status(200).json(successResponse(hotel, "HOTEL_UPDATED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

//
// ADMIN
//

// GET /api/hotel/admin
export const getAllHotels = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const data = await hotelService.getAllHotels({ status, page, limit });

    return res
      .status(200)
      .json(successResponse(data, "ALL_HOTELS", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// GET /api/hotel/admin/pending
export const getPendingHotels = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const data = await hotelService.getPendingHotels({ page, limit });

    return res
      .status(200)
      .json(successResponse(data, "PENDING_HOTELS", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// PATCH /api/hotel/admin/:hotelId/approve
export const approveHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await hotelService.approveHotel(hotelId);

    return res
      .status(200)
      .json(successResponse(hotel, "HOTEL_APPROVED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// PATCH /api/hotel/admin/:hotelId/reject
export const rejectHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await hotelService.rejectHotel(hotelId);

    return res
      .status(200)
      .json(successResponse(hotel, "HOTEL_REJECTED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// POST /api/hotel/:id/images
export const uploadHotelImages = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json(errorResponse("HOTEL_NOT_FOUND", 404));
    }

    // owner는 본인 호텔만 업로드 가능 (admin은 전체 가능)
    if (
      req.user?.role !== "admin" &&
      hotel.owner &&
      hotel.owner.toString() !== (req.user.id || req.user._id)?.toString()
    ) {
      return res.status(403).json(errorResponse("NO_PERMISSION", 403));
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json(errorResponse("NO_IMAGES_UPLOADED", 400));
    }

    const imageUrls = req.files.map((file) => file.location);
    hotel.images = [...(hotel.images || []), ...imageUrls];
    await hotel.save();

    return res
      .status(200)
      .json(successResponse(hotel, "HOTEL_IMAGE_UPLOADED", 200));
  } catch (err) {
    console.error(err);
    return res.status(400).json(errorResponse(err.message, 400));
  }
};
