// Importing Dependencies
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

// Importing Routes
import authRoute from "../src/routes/auth.routes.js";

// Importing Middleware
import AppError from "./middleware/AppError.middleware.js";

// Initializing Express App and dotenv
const app = express();
dotenv.config();

// Middleware Setup
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

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    message: "server is running",
  });
});

// Api Routes Setup
app.use("/api/v1/auth", authRoute);

// 404 Error Handler
app.use((req, res, next) => {
  throw new AppError(404, "Route not found", false, "Route not found");
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    message,
    statusCode: statusCode,
    success: false,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
