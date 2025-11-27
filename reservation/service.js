// reservation/service.js
import Reservation from "./model.js";

// 예약 생성
export const createReservation = async (data) => {
  return await Reservation.create(data);
};

// 예약 상세 조회
export const getReservationById = async (id) => {
  const reservation = await Reservation.findById(id)
    .populate("user", "name email")
    .populate("room", "name price");

  if (!reservation) {
    const error = new Error("RESERVATION_NOT_FOUND");
    error.statusCode = 404;
    throw error;
  }

  return reservation;
};

// 특정 유저의 예약 목록
export const getReservationsByUser = async (userId) => {
  return await Reservation.find({ user: userId })
    .populate("room", "name price")
    .sort({ createdAt: -1 });
};

// 예약 취소
export const cancelReservation = async (id, userId) => {
  const reservation = await Reservation.findOne({ _id: id, user: userId });

  if (!reservation) {
    const error = new Error("NOT_FOUND_OR_UNAUTHORIZED");
    error.statusCode = 404;
    throw error;
  }

  reservation.status = "cancelled";
  return await reservation.save();
};
