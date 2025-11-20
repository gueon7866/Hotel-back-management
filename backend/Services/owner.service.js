// backend/services/owner.service.js
import Hotel from "../models/Hotel.js";

export const getHotelsByOwner = (ownerId) => {
  return Hotel.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export const createHotel = (ownerId, data) => {
  return Hotel.create({
    ...data,
    owner: ownerId,
    status: "PENDING",
  });
};

export const updateHotel = async (ownerId, hotelId, data) => {
  const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
  if (!hotel) {
    const err = new Error("해당 호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  Object.assign(hotel, data);
  // 수정 시 다시 PENDING으로 돌릴지 여부는 팀에서 룰 정하기
  // hotel.status = "PENDING";

  await hotel.save();
  return hotel;
};
