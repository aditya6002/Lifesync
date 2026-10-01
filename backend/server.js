import app from "./src/app.js";
import connectDb from "./src/config/db.js";

connectDb()
  .then(() => {
    app.listen(8080, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log("Server error", err);
    process.exit(1);
  });
