// hotel/controller.js
import * as hotelService from "./service.js";
import { successResponse, errorResponse } from "../common/response.js";

//
// OWNER(사업자) 컨트롤러
//

// GET /api/hotel/owner
export const getMyHotels = async (req, res) => {
  try {
    const ownerId = req.user.id;
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
    const ownerId = req.user.id;
    const hotel = await hotelService.createHotel(ownerId, req.body);

    return res
      .status(201)
      .json(successResponse(hotel, "HOTEL_CREATED_PENDING", 201));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// PATCH /api/hotel/owner/:hotelId
export const updateHotel = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.params;

    const hotel = await hotelService.updateHotel(ownerId, hotelId, req.body);

    return res.status(200).json(successResponse(hotel, "HOTEL_UPDATED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

//
// ADMIN 컨트롤러

// GET /api/hotel/admin/pending
export const getPendingHotels = async (_req, res) => {
  try {
    const hotels = await hotelService.getPendingHotels();
    return res
      .status(200)
      .json(successResponse(hotels, "PENDING_HOTELS", 200));
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
// ⬆⬆ hotel/controller.js ADMIN 컨트롤러 교체 끝 ⬆⬆