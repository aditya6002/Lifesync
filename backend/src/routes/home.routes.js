const express = require("express");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");
const homeControllers = require("../controllers/home.controller");
const wrapAsync = require("../middleware/wrapAsync.middleware");

router.get("/", isUserLogin, wrapAsync(homeControllers.getHomeData));

module.exports = router;
