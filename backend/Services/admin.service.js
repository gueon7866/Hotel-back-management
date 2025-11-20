// backend/services/admin.service.js
import Hotel from "../models/Hotel.js";

export const getPendingHotels = () => {
  return Hotel.find({ status: "PENDING" }).populate("owner", "email name");
};

export const approveHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  hotel.status = "APPROVED";
  hotel.rejectReason = undefined;
  await hotel.save();
  return hotel;
};

export const rejectHotel = async (hotelId, reason) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  hotel.status = "REJECTED";
  hotel.rejectReason = reason || "관리자에 의해 반려되었습니다.";
  await hotel.save();
  return hotel;
};
