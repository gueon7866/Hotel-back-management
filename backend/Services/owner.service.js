// backend/Services/owner.service.js
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

/**
 * 내 호텔 목록 조회
 */
export const getHotelsByOwner = async (ownerId, options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const filter = { owner: ownerId };

  const [items, total] = await Promise.all([
    Hotel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
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

/**
 * 호텔 생성
 */
export const createHotel = async (ownerId, data) => {
  const {
    name,
    description,
    city,
    address,
    location,
    images,
    amenities,
  } = data;

  if (!name || !city) {
    const err = new Error("name과 city는 필수입니다.");
    err.status = 400;
    throw err;
  }

  const hotel = await Hotel.create({
    name,
    description,
    city,
    address,
    location,
    images: Array.isArray(images) ? images : [],
    amenities: Array.isArray(amenities) ? amenities : [],
    owner: ownerId,
    status: "pending", // 항상 승인 대기 상태로 시작
  });

  return hotel;
};

/**
 * 호텔 수정
 */
export const updateHotel = async (ownerId, hotelId, data) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    const err = new Error("해당 호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  if (hotel.owner.toString() !== ownerId) {
    const err = new Error("본인이 소유한 호텔만 수정할 수 있습니다.");
    err.status = 403;
    throw err;
  }

  const updatableFields = [
    "name",
    "description",
    "city",
    "address",
    "location",
    "images",
    "amenities",
  ];

  updatableFields.forEach((field) => {
    if (data[field] !== undefined) {
      hotel[field] = data[field];
    }
  });

  const updated = await hotel.save();
  return updated;
};

/**
 * 객실 생성
 */
export const createRoom = async (ownerId, hotelId, data) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    const err = new Error("해당 호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  if (hotel.owner.toString() !== ownerId) {
    const err = new Error("본인이 소유한 호텔에만 객실을 추가할 수 있습니다.");
    err.status = 403;
    throw err;
  }

  const { name, type, price, capacity, inventory, images, amenities } = data;

  if (!name || !type || price == null || capacity == null || inventory == null) {
    const err = new Error("이름, 유형, 가격, 수용인원, 재고는 필수입니다.");
    err.status = 400;
    throw err;
  }

  const room = await Room.create({
    hotel: hotelId,
    name,
    type,
    price,
    capacity,
    inventory,
    images: Array.isArray(images) ? images : [],
    amenities: Array.isArray(amenities) ? amenities : [],
  });

  return room;
};

/**
 * 객실 수정
 */
export const updateRoom = async (ownerId, roomId, data) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const err = new Error("해당 객실을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const hotel = await Hotel.findById(room.hotel);
  if (!hotel) {
    const err = new Error("해당 객실의 호텔 정보를 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  if (hotel.owner.toString() !== ownerId) {
    const err = new Error("본인이 소유한 호텔의 객실만 수정할 수 있습니다.");
    err.status = 403;
    throw err;
  }

  const updatable = [
    "name",
    "type",
    "price",
    "capacity",
    "inventory",
    "images",
    "amenities",
    "status",
  ];

  updatable.forEach((field) => {
    if (data[field] !== undefined) {
      room[field] = data[field];
    }
  });

  const updated = await room.save();
  return updated;
};

/**
 * 객실 삭제
 */
export const deleteRoom = async (ownerId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const err = new Error("해당 객실을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const hotel = await Hotel.findById(room.hotel);
  if (!hotel) {
    const err = new Error("해당 객실의 호텔 정보를 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  if (hotel.owner.toString() !== ownerId) {
    const err = new Error("본인이 소유한 호텔의 객실만 삭제할 수 있습니다.");
    err.status = 403;
    throw err;
  }

  await Room.findByIdAndDelete(roomId);
  return true;
};
