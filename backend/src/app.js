const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

// Load environment variables
dotenv.config({ debug: true, override: true, quiet: true });

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());
const upload = multer({ dest: "uploads/" }); //({ storage: multer.memoryStorage() });
app.use(cookieParser());

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
