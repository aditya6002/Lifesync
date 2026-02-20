const { body, validationResult } = require("express-validator");
const AppError = require("./AppError.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0]?.msg || "Validation error";
    throw new AppError(msg, 400);
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
