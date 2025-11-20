// backend/controllers/admin.controller.js
import * as adminService from "./services/admin.service.js";

export const getPendingHotels = async (req, res, next) => {
  try {
    const hotels = await adminService.getPendingHotels();
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

export const approveHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await adminService.approveHotel(hotelId);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

export const rejectHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { reason } = req.body;
    const hotel = await adminService.rejectHotel(hotelId, reason);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};
