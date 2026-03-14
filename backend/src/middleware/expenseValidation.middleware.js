const { body, param, query, validationResult } = require("express-validator");
const AppError = require("./errors.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0]?.msg || "Validation error";
    throw new AppError(msg, 400);
  }
  next();
};

const createTaskValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Invalid title")
    .isLength({ min: 5, max: 40 })
    .withMessage("Title must be between 5 and 40 characters"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Invalid content")
    .isLength({ min: 1, max: 100 })
    .withMessage("Content must be between 1 and 100 characters"),

  body("amount").notEmpty().withMessage("Amount is required"),
  validateResult,
];

const editTaskValidationRules = [
  body("expense.title")
    .optional()
    .isString()
    .withMessage("Invalid title")
    .isLength({ min: 3, max: 40 })
    .withMessage("Title must be between 3 and 40 characters"),

  body("expense.content")
    .optional()
    .isString()
    .withMessage("Invalid content")
    .isLength({ min: 1, max: 100 })
    .withMessage("Content must be between 1 and 100 characters"),
  body("expense.amount").notEmpty().withMessage("Amount is required"),
  validateResult,
];

const getAllTaskValidationRules = [
  param("skip")
    .notEmpty()
    .withMessage("Skip is required")
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive number"),
  param("limit")
    .notEmpty()
    .withMessage("Limit is required")
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive number"),
  param("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 1 })
    .withMessage("Year must be a positive number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Invalid year"),
  param("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1 })
    .withMessage("Month must be a positive number")
    .isLength({ min: 1, max: 2 })
    .withMessage("Invalid month"),

  validateResult,
];

const deleteTaskValidationRules = [
  param("expenseId")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID"),

  validateResult,
];

module.exports = {
  createRules: createTaskValidationRules,
  editRules: editTaskValidationRules,
  getAllRules: getAllTaskValidationRules,
  deleteRules: deleteTaskValidationRules,
};
