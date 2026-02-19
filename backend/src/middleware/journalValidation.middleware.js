const { body, param, validationResult } = require("express-validator");
const AppError = require("./AppError.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.errors[0].msg || "Server error";
    throw new AppError(msg, 400);
  }
  next();
};

const journalValidationRules = [
  body("title").isString().withMessage("Invalid  title").isLength({ min: 5 }),
  body("content")
    .isString()
    .withMessage("Content must be string")
    .isLength({ min: 5 }),
  validateResult,
];

const expenseValidationRules = [
  body("title")
    .isString()
    .withMessage("Invalid  category")
    .isLength({ min: 5 }),
  body("content")
    .isString()
    .withMessage("Description must be string")
    .isLength({ min: 5 }),
  validateResult,
];

const noteValidationRules = [
  body("title").isString().withMessage("Invalid  title").isLength({ min: 5 }),
  body("content")
    .isString()
    .withMessage("Content must be string")
    .isLength({ min: 5 }),
  validateResult,
];

const taskValidationRules = [
  body("title").isString().withMessage("Invalid  title").isLength({ min: 5 }),
  body("content")
    .isString()
    .withMessage("Content must be string")
    .isLength({ min: 5 }),
  validateResult,
];

module.exports = {
  journalValidationRules,
  expenseValidationRules,
  noteValidationRules,
  taskValidationRules,
};
