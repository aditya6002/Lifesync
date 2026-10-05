import { body } from "express-validator";
import expenseList from "../expenseList.js";

const expenseFormValidator = [
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(expenseList)
    .withMessage("Invalid category")
    .trim()
    .toLowerCase(),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Note is too long"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number")
    .trim(),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

export default expenseFormValidator;
