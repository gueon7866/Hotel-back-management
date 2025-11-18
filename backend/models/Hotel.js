// backend/models/Hotel.js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectReason: { type: String },

    mainImageUrl: { type: String },
    imageUrls: [{ type: String }],

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
