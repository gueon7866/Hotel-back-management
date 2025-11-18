// backend/controllers/owner.controller.js
const ownerService = require("./services/owner.service");

exports.getMyHotels = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hotels = await ownerService.getHotelsByOwner(ownerId);
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

exports.createHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const hotel = await ownerService.createHotel(ownerId, req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { hotelId } = req.params;
    const hotel = await ownerService.updateHotel(ownerId, hotelId, req.body);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};
