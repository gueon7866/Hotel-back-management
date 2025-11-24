// backend/controllers/owner.controller.js
import * as ownerService from "../Services/owner.service.js";

/**
 * GET /api/owner/hotels
 * 내 호텔 목록 조회
 */
export const getMyHotels = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await ownerService.getHotelsByOwner(ownerId, { page, limit });

    res.json({
      success: true,
      data: {
        items: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/owner/hotels
 * 호텔 생성 (등록 요청 -> status: pending)
 */
export const createHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hotel = await ownerService.createHotel(ownerId, req.body);

    res.status(201).json({
      success: true,
      data: hotel,
      message: "호텔 등록 요청이 완료되었습니다. 승인 대기 중입니다.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/owner/hotels/:hotelId
 * 내 호텔 수정
 */
export const updateHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.params;

    const hotel = await ownerService.updateHotel(ownerId, hotelId, req.body);

    res.json({
      success: true,
      data: hotel,
      message: "호텔 정보가 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/owner/hotels/:hotelId/rooms
 * 객실 생성
 */
export const createRoom = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.params;

    const room = await ownerService.createRoom(ownerId, hotelId, req.body);

    res.status(201).json({
      success: true,
      data: room,
      message: "객실이 성공적으로 추가되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { roomId } = req.params;

    const room = await ownerService.updateRoom(ownerId, roomId, req.body);

    res.json({
      success: true,
      data: room,
      message: "객실 정보가 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { roomId } = req.params;

    await ownerService.deleteRoom(ownerId, roomId);

    res.json({
      success: true,
      message: "객실이 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

