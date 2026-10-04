import { body } from "express-validator";

const taskFormValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 80 })
    .withMessage("Title must be at most 80 characters long")
    .isString()
    .withMessage("Title must be a string"),
  body("note")
    .trim()
    .optional()
    .isLength({ max: 100 })
    .withMessage("Note must be at most 100 characters long")
    .isString()
    .withMessage("Note must be a string"),
  body("dueDate")
    .trim()
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid due date"),
  body("startingTime")
    .trim()
    .notEmpty()
    .withMessage("Starting time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid starting time"),
  body("endingTime")
    .trim()
    .notEmpty()
    .withMessage("Ending time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid ending time"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("status").optional().isBoolean().withMessage("Status must be a boolean"),
];

export default taskFormValidator;
