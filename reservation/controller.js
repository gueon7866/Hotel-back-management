// reservation/controller.js
import { successResponse, errorResponse } from "../common/response.js";
import {
  getAdminReservations,
  getOwnerReservations,
  updateReservationStatus,
} from "./service.js";

// 🔹 ADMIN: 전체 예약 조회
export const getReservationsForAdmin = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending 이런 식으로 필터 가능
    const data = await getAdminReservations({ status });

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_ADMIN_LIST", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(errorResponse(err.message || "RESERVATION_ADMIN_LIST_FAILED", 400));
  }
};

// 🔹 OWNER: 내 호텔들 예약 조회
export const getReservationsForOwner = async (req, res) => {
  try {
    const { status } = req.query;
    const ownerId = req.user.id; // JWT에서 들어온 내 userId

    const data = await getOwnerReservations({ ownerId, status });

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_OWNER_LIST", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(errorResponse(err.message || "RESERVATION_OWNER_LIST_FAILED", 400));
  }
};

// 🔹 ADMIN / OWNER: 예약 상태 변경
export const patchReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json(errorResponse("status 값이 필요합니다.", 400));
    }

    const data = await updateReservationStatus({ reservationId: id, status });

    return res
      .status(200)
      .json(successResponse(data, "RESERVATION_STATUS_UPDATED", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(errorResponse(err.message || "RESERVATION_STATUS_UPDATE_FAILED", 400));
  }
};
