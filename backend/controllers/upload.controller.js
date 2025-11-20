// backend/controllers/upload.controller.js
import * as uploadService from "./services/upload.service.js";

export const handleHotelImagesUpload = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const files = req.files; // multer-s3가 채워줌
    const ownerId = req.user.id;

    const result = await uploadService.saveHotelImages(ownerId, hotelId, files);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
