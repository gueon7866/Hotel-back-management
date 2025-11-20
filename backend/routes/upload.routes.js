// backend/routes/upload.routes.js
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3, BUCKET, getHotelImageKey } from "../utils/s3.js";
import auth from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import * as uploadController from "../controllers/upload.controller.js";

const router = express.Router();

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

export default router;
