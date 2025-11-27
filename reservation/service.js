// reservation/service.js
import Reservation from "./model.js";
import Hotel from "../hotel/model.js";

// 🔹 ADMIN: 전체 예약 조회 (옵션 status 필터)
export const getAdminReservations = async ({ status }) => {
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const reservations = await Reservation.find(filter)
    .populate("userId", "name email")   // 손님 정보
    .populate("hotelId", "name city")   // 호텔 정보
    .populate("roomId", "roomNumber")   // 방 정보 (필드명은 모델에 맞게)
    .sort({ createdAt: -1 });

  return reservations;
};

// 🔹 OWNER: 내 호텔들에 대한 예약만 조회
export const getOwnerReservations = async ({ ownerId, status }) => {
  // 1️⃣ 오너가 가진 호텔들 ID 목록 가져오기
  const hotels = await Hotel.find({ owner: ownerId }).select("_id");
  const hotelIds = hotels.map((h) => h._id);

  if (hotelIds.length === 0) {
    // 내 호텔이 하나도 없으면 예약도 없음
    return [];
  }

  // 2️⃣ 그 호텔들에 대한 예약만 조회
  const filter = { hotelId: { $in: hotelIds } };
  if (status) {
    filter.status = status;
  }

  const reservations = await Reservation.find(filter)
    .populate("userId", "name email")
    .populate("hotelId", "name city")
    .populate("roomId", "roomNumber")
    .sort({ createdAt: -1 });

  return reservations;
};

// 🔹 ADMIN / OWNER: 예약 상태 변경
export const updateReservationStatus = async ({ reservationId, status }) => {
  const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];
  if (!allowedStatus.includes(status)) {
    throw new Error("허용되지 않은 상태값입니다.");
  }

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error("예약을 찾을 수 없습니다.");
  }

  reservation.status = status;
  await reservation.save();

  return reservation;
};
