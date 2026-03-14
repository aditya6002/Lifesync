const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { ApiError } = require("./middleware/errors.middleware.js");
dotenv.config({ debug: true, override: true, quiet: true });

const app = express();

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === "/health";
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "10mb", // Limit request body size
    strict: true, // Only parse valid JSON
  }),
);
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  }),
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(globalRateLimiter);

process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

const upload = multer({ dest: "uploads/" }); //({ storage: multer.memoryStorage() });

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    message: "Server is running",
  });
});

app.use("/auth", require("./routes/auth.routes.js"));
app.use("/tasks", require("./routes/tasks.routes.js"));
app.use("/expenses", require("./routes/expenses.routes"));
app.use("/chatbot", require("./routes/chatbot.routes.js"));
app.use("/calendar", require("./routes/calendar.routes.js"));
app.use("/home", require("./routes/home.routes.js"));
app.use("/journal", require("./routes/journal.routes.js"));
app.use("/notes", require("./routes/notes.routes.js"));

app.use("/", (req, res) => {
  res.redirect("/home");
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
    details: {
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
    },
  });
});

const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    name: err.name,
    code: err.code,
    message: err.message,
    status: err.statusCode || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  // Default error
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred. Please try again later.";
  let details = {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = err.message;
  } else if (err.name === "MongoError") {
    statusCode = 500;
    code = "DATABASE_ERROR";
    message = "Database operation failed";
  } else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    code: code,
    ...(process.env.NODE_ENV === "development" && { details }),
  });
};

app.use(errorHandler);

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", {
    promise,
    reason,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;




app.post("/upload", upload.single("file"), (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Process the file and data as needed
  console.log("Received file:", file);
  console.log("Received data:", data);

  res.json({ success: true, message: "File uploaded successfully" });
});

app.get("/file", async (req, res) => {
  try {
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const filePath = path.join(__dirname, "..", "uploads", filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ error: "Failed to serve file" });
  }
});
