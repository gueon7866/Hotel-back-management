// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./config/db.js";                // MongoDB 연결
import registerRoutes from "./routes/index.js"; // 도메인별 라우트 등록
import errorHandler from "./common/errorHandler.js"; // 공통 에러 핸들러

// .env 로드
dotenv.config();

const app = express();

// 공통 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 등록 (/api/...)
registerRoutes(app);

// 404 핸들링 (선택)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "NOT_FOUND",
    path: req.originalUrl,
  });
});

// 에러 핸들러 (항상 마지막)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export default app;
