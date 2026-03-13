const app = require("./src/app");
const connectDB = require("./src/db/db.js");


// Connect to db
connectDB();

// Start the server
app.listen(8080, () => {
  console.log("base url - http://localhost:8080/");
  console.log(
    `
┌─────────────┬───────────────┬──────────────────────────────────┬──────┐
│ Method      │ Path          │ Description                      │ Auth │
├─────────────┼───────────────┼──────────────────────────────────┼──────┤
│ POST        │ /api/signup   │ Create new account               │ No   │
│ POST        │ /api/auth/login     │ Login                            │ No   │
│ GET         │ /api/auth/verify    │ Verify token                     │ Yes  │
│ GET         │ /api/get-me   │ Get current user                 │ Yes  │
│ POST        │ /api/refresh  │ Refresh token                    │ Yes  │
│ POST        │ /api/logout   │ Logout                           │ Yes  │
│ GET         │ /health       │ Health check                     │ No   │
| GET         | /
└─────────────┴───────────────┴──────────────────────────────────┴──────┘
`,
  );
});
