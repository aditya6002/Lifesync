const express = require("express");
const calendarControllers = require("../controllers/calendar.controller");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync");

router.get(
  "/:date/:month/:year",
  isUserLogin,
  wrapAsync(calendarControllers.getDataByDate),
);

module.exports = router;
