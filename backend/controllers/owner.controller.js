// backend/controllers/owner.controller.js
import * as ownerService from "./services/owner.service.js";

export const getMyHotels = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hotels = await ownerService.getHotelsByOwner(ownerId);
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hotel = await ownerService.createHotel(ownerId, req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.params;
    const hotel = await ownerService.updateHotel(ownerId, hotelId, req.body);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};
