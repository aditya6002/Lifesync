import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoute from "../src/routes/auth.routes.js";

const app = express();
dotenv.config();

app.use(
  express.json({
    limits: "10mb",
    credentials: true,
  }),
);
app.use(
  express.urlencoded({
    limits: "10mb",
    extended: true,
  }),
);
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    message: "server is running",
  });
});

app.use("/api/v1/auth", authRoute);

export default app;
