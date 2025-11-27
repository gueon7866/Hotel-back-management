// reservation/controller.js
import * as reservationService from "./service.js";
import { successResponse, errorResponse } from "../common/response.js";

// POST /api/reservation
export const createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { room, checkIn, checkOut, guests } = req.body;

    const data = await reservationService.createReservation({
      user: userId,
      room,
      checkIn,
      checkOut,
      guests,
    });

    return res
      .status(201)
      .json(successResponse(data, "RESERVATION_CREATED", 201));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};

// GET /api/reservation/:id
export const getReservationDetail = async (req, res) => {
  try {
    const data = await reservationService.getReservationById(req.params.id);

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_DETAIL", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 404)
      .json(errorResponse(err.message, err.statusCode || 404));
  }
};

// GET /api/reservation/me
export const getMyReservations = async (req, res) => {
  try {
    const data = await reservationService.getReservationsByUser(req.user.id);

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_LIST", 200));
  } catch (err) {
    return res
      .status(400)
      .json(errorResponse("RESERVATION_FETCH_FAIL", 400));
  }
};

// PATCH /api/reservation/:id/cancel
export const cancelReservation = async (req, res) => {
  try {
    const data = await reservationService.cancelReservation(
      req.params.id,
      req.user.id
    );

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_CANCELLED", 200));
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json(errorResponse(err.message, err.statusCode || 400));
  }
};
