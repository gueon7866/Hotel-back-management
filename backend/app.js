// backend/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

require("./config/db"); // DB 연결
const routes = require("./routes");
const errorHandler = require("./middlewares/error.handler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API prefix
app.use("/api/v1", routes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// 전역 에러 핸들러
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`hotel-back-management running on port ${PORT}`);
});
