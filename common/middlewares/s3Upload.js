import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

// ✅ .env 키 이름이 섞여 있어도 동작하도록 최대한 호환
const region = process.env.AWS_REGION || process.env.REGION;
const accessKeyId =
  process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
const secretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;

if (!process.env.AWS_S3_BUCKET) {
  console.warn("[S3] AWS_S3_BUCKET is not set.");
}
if (!region) {
  console.warn("[S3] REGION/AWS_REGION is not set.");
}

const s3 = new AWS.S3({
  region,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const s3ImageUpload = (folder) =>
  multer({
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const err = new Error("INVALID_IMAGE_TYPE");
        err.status = 400;
        return cb(err, false);
      }
      cb(null, true);
    },
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        // 원본 파일명에 공백/특수문자가 들어가면 URL/키 이슈가 날 수 있어 간단히 정리
        const safeName = file.originalname
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "");
        cb(null, `${folder}/${Date.now()}-${safeName}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
