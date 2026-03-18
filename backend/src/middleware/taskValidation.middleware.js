const { body, param, validationResult } = require("express-validator");
const AppError = require("./errors.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].message || "Server error";
    throw new AppError(message, 400);
  }
  next();
};

const createTaskValidationRules = [
  body("title")
    .isString()
    .withMessage("Invalid  title")
    .isLength({ min: 5, max: 40 })
    .withMessage("Invalid title"),
  body("content")
    .isString()
    .withMessage("Invalid content")
    .isLength({ min: 1, max: 40 })
    .withMessage("Invalid content"),
  validateResult,
];

const editTaskValidationRules = [
  body("task.userId")
    .notEmpty()
    .withMessage("UserId is required")
    .isMongoId()
    .withMessage("Invalid UserId"),

  body("task.title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 40 })
    .withMessage("Title must be at least 3 characters"),

  body("task.content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1, max: 40 })
    .withMessage("Content must be at least 5 characters"),

  validateResult,
];

const getAllTaskValidationRules = [
  param("skip").notEmpty().withMessage("Skip is required"),
  param("limit").notEmpty().withMessage("Limit is required"),
  validateResult,
];

const deleteTaskValidationRules = [
  param("taskId")
    .notEmpty()
    .withMessage("Journal id is required")
    .isMongoId()
    .withMessage("Wrong journal id"),
  validateResult,
];

module.exports = {
  createRules: createTaskValidationRules,
  editRules: editTaskValidationRules,
  getRules: getAllTaskValidationRules,
  deleteRules: deleteTaskValidationRules,
};
