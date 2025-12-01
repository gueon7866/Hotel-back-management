// hotel/service.js
import Hotel from "./model.js";

//
// OWNER(사업자) 서비스
//

// 내 호텔 목록 (페이징)
export const getHotelsByOwner = async (ownerId, options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const filter = { owner: ownerId };

  const [items, total] = await Promise.all([
    Hotel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Hotel.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// 호텔 생성 (항상 pending으로 시작)
export const createHotel = async (ownerId, data) => {
  const { name, city } = data;

  if (!name || !city) {
    const err = new Error("NAME_CITY_REQUIRED");
    err.statusCode = 400;
    throw err;
  }

  const hotel = await Hotel.create({
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    owner: ownerId,
    status: "pending",
  });

  return hotel;
};

// 호텔 수정 (본인 소유만)
export const updateHotel = async (ownerId, hotelId, updates) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("HOTEL_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  if (hotel.owner.toString() !== ownerId) {
    const err = new Error("NO_PERMISSION");
    err.statusCode = 403;
    throw err;
  }

  const fields = [
    "name",
    "description",
    "city",
    "address",
    "location",
    "images",
    "amenities",
    "basePrice",
    "tags",
  ];

  fields.forEach((f) => {
    if (updates[f] !== undefined) {
      hotel[f] = updates[f];
    }
  });

  return await hotel.save();
};

//
// ADMIN 서비스

// 승인 대기 호텔 목록
export const getPendingHotels = async () => {
  return await Hotel.find({ status: "pending" }).sort({ createdAt: -1 });
};

// 호텔 승인
export const approveHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("HOTEL_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  if (hotel.status === "approved") {
    const err = new Error("HOTEL_ALREADY_APPROVED");
    err.statusCode = 400;
    throw err;
  }

  if (hotel.status === "rejected") {
    const err = new Error("HOTEL_ALREADY_REJECTED");
    err.statusCode = 400;
    throw err;
  }

  hotel.status = "approved";
  return await hotel.save();
};

// 호텔 반려
export const rejectHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("HOTEL_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  if (hotel.status === "rejected") {
    const err = new Error("HOTEL_ALREADY_REJECTED");
    err.statusCode = 400;
    throw err;
  }

  if (hotel.status === "approved") {
    const err = new Error("HOTEL_ALREADY_APPROVED");
    err.statusCode = 400;
    throw err;
  }

  hotel.status = "rejected";
  return await hotel.save();
};
// ⬆⬆ hotel/service.js ADMIN 서비스 부분 교체 끝 ⬆⬆
