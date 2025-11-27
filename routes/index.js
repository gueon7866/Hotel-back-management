// routes/index.js
import authRoute from "../auth/route.js";
import userRoute from "../user/route.js";
import hotelRoute from "../hotel/route.js";
import roomRoute from "../room/route.js";
import reservationRoute from "../reservation/route.js";
import couponRoute from "../coupon/route.js";
import favoriteRoute from "../favorite/route.js";
import paymentRoute from "../payment/route.js";
import reviewRoute from "../review/route.js"; // 나중에 만들면

export default function registerRoutes(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/hotel", hotelRoute);
  app.use("/api/room", roomRoute);
  app.use("/api/reservation", reservationRoute);
  app.use("/api/coupons", couponRoute);     // 복수형
  app.use("/api/favorite", favoriteRoute);
  app.use("/api/payments", paymentRoute);   // 복수형
  app.use("/api/review", reviewRoute);
}
