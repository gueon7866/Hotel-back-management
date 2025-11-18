// backend/routes/upload.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3, BUCKET, getHotelImageKey } = require("../utils/s3");
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const uploadController = require("../controllers/upload.controller");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const hotelId = req.params.hotelId;
      const key = getHotelImageKey(hotelId, file.originalname);
      cb(null, key);
    },
  }),
});

router.post(
  "/hotels/:hotelId/images",
  auth,
  requireRole("OWNER"),
  upload.array("images", 5),
  uploadController.handleHotelImagesUpload
);

module.exports = router;
