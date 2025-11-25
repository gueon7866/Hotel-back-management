// routes/index.js
import authRoute from "../auth/route.js";
import userRoute from "../user/route.js";
import hotelRoute from "../hotel/route.js";
import roomRoute from "../room/route.js";
app.use("/api/room", roomRoute);

// ... 다른 도메인들 import

export default function registerRoutes(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/hotel", hotelRoute);
  // app.use("/api/room", roomRoute);
  // app.use("/api/reservation", reservationRoute);
  // ...
}
