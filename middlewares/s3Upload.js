import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

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
        cb(
          null,
          `${folder}/${Date.now()}-${file.originalname}`
        );
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
