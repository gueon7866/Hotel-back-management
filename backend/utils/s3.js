// backend/utils/s3.js
import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const BUCKET = process.env.AWS_S3_BUCKET;

export function getHotelImageKey(hotelId, originalName) {
  const ext = originalName.split(".").pop();
  const timestamp = Date.now();
  return `hotels/${hotelId}/${timestamp}.${ext}`;
}
