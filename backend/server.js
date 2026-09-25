const app = require("./src/app");
const connectDB = require("./src/db/db.js");
const cglMsg = require("./src/utils/serverMsg.js");

// Connect to db
connectDB();

const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  cglMsg(port);
});
