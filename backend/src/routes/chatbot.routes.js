const express = require("express");
const { isUserLoggedIn } = require("../controllers/auth.controller");
const wrapAsync = require("../middleware/wrapAsync.middleware");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.controller");
// Remove the node-fetch import

router.post("/", wrapAsync(chatbotController.chatbot));

module.exports = router;
