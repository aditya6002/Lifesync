const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync.middleware");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.controller");
const chatbotValidationRules = require("../middleware/chatbotValidation.middleware");

router.post(
  "/",
  isUserLogin,
  chatbotValidationRules.chatbotValidationRules,
  wrapAsync(chatbotController.chatbot),
);

module.exports = router;
