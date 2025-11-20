// backend/models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    name: { type: String, required: true },
    description: { type: String },

    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },

    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
