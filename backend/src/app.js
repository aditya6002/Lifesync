// Importing Dependencies
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import express from "express";
import morgan from "morgan";

import helmet from "helmet";
import cookieParser from "cookie-parser";

// Importing Routes
import authRoute from "../src/routes/auth.routes.js";
import journalRoute from "../src/routes/journal.routes.js";
import noteRoute from "../src/routes/note.routes.js";
import taskRoute from "../src/routes/task.routes.js";

// Importing Middleware
import AppError from "./middleware/AppError.middleware.js";
import globalLimiter from "./middleware/globalRateLimit.middleware.js";

// Initializing Express App and dotenv
const app = express();

// CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-refresh-token"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Middleware Setup
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(
  express.urlencoded({
    limit: "5mb",
    extended: true,
  })
);
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(globalLimiter);

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    message: "server is running",
  });
});

// Api Routes Setup
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/journal", journalRoute);
app.use("/api/v1/note", noteRoute);
app.use("/api/v1/task", taskRoute);

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
