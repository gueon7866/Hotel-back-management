import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/s3.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const s3ImageUpload = (folder) =>
  multer({
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("INVALID_IMAGE_TYPE"), false);
      }
      cb(null, true);
    },
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const filename = `${folder}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${ext}`;
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
