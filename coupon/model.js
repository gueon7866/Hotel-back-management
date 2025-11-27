// coupon/model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    discountType: { type: String, enum: ["percent", "amount"], required: true },
    discountValue: { type: Number, required: true },

    minAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },

    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },

    isActive: { type: Boolean, default: true },

    usageLimit: { type: Number, default: 0 }, // 0 = 무제한
    usedCount: { type: Number, default: 0 },

    creator: { type: Schema.Types.ObjectId, ref: "User" }, // owner or admin
    targetHotel: { type: Schema.Types.ObjectId, ref: "Hotel" }, // 특정 호텔 전용 가능
  },
  { timestamps: true }
);

couponSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Coupon", couponSchema);
