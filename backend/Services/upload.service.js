// backend/services/upload.service.js
const Hotel = require("../models/Hotel");

exports.saveHotelImages = async (ownerId, hotelId, files) => {
  const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
  if (!hotel) {
    const err = new Error("해당 호텔을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const urls = files.map((file) => file.location); // multer-s3가 넣어주는 필드

  // 메인 이미지 없으면 첫 번째 이미지로
  if (!hotel.mainImageUrl && urls.length > 0) {
    hotel.mainImageUrl = urls[0];
  }

  hotel.imageUrls = [...(hotel.imageUrls || []), ...urls];
  await hotel.save();

  return { hotelId: hotel._id, imageUrls: hotel.imageUrls };
};
