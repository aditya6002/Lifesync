const dotenv = require("dotenv").config();

const clgMsg = (port) => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 SERVER STARTED SUCCESSFULLY 🚀                ║
╚════════════════════════════════════════════════════════════╝

📍 Server URL: http://localhost:${port}
🌍 Environment: ${process.env.NODE_ENV}
🔐 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}
⏰ Started at: ${new Date().toISOString()}

📚 Available Endpoints:
    GET    /health                  - Health check
    POST   /api/auth/register       - Create new account
    POST   /api/auth/login          - Login to account
    POST   /api/auth/me             - Get current user (requires auth)
    POST   /api/auth/logout         - Logout (requires auth)
    POST   /api/auth/refresh-token  - Refresh token (requires auth)


💡 Tips:

    - Check console logs for detailed information
    - Use rate limiting to prevent abuse
    - All errors are returned with code and message

═════════════════════════════════════════════════════════════
`);
};

module.exports = clgMsg;
