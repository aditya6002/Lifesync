const app = require("./src/app");
const connectDB = require("./src/db/db.js");

// Connect to db
connectDB();

const port = process.env.PORT;

// Start the server
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 SERVER STARTED SUCCESSFULLY 🚀                ║
╚════════════════════════════════════════════════════════════╝

📍 Server URL: http://localhost:${port}
🌍 Environment: ${process.env.NODE_ENV}
🔐 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}
⏰ Started at: ${new Date().toISOString()}

📚 Available Endpoints:
  POST   /api/auth/signup        - Create new account
  POST   /api/auth/login         - Login to account
  GET    /api/auth/verify        - Verify token (requires auth)
  GET    /api/auth/me            - Get current user (requires auth)
  POST   /api/auth/refresh       - Refresh token (requires auth)
  POST   /api/auth/logout        - Logout (requires auth)
  GET    /health                 - Health check
  
💡 Tips:
  
  - Check console logs for detailed information
  - Use rate limiting to prevent abuse
  - All errors are returned with code and message

═════════════════════════════════════════════════════════════
  `);
  // - Add Bearer token in Authorization header for protected routes
});
