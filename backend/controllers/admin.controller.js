// backend/controllers/admin.controller.js
const adminService = require("./services/admin.service");

exports.getPendingHotels = async (req, res, next) => {
  try {
    const hotels = await adminService.getPendingHotels();
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

exports.approveHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await adminService.approveHotel(hotelId);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

exports.rejectHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { reason } = req.body;
    const hotel = await adminService.rejectHotel(hotelId, reason);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};
