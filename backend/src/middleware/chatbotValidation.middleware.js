const { body, validationResult } = require("express-validator");
const AppError = require("./errors.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }
};

const chatbotValidationRules = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 1, max: 120 })
    .withMessage("Message is to long"),
  validateResult,
];

module.exports = {
  chatbotValidationRules,
};
