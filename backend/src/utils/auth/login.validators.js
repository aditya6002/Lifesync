import { body } from "express-validator";
import AppError from "../../middleware/AppError.middleware.js";

const loginValidationRules = [
  body("loginId")
    .trim()
    .notEmpty()
    .withMessage("Email or Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Input length must be between 3 and 50 characters")
    .escape()
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      const isUsername = /^[a-zA-Z0-9_]+$/.test(value);

      if (!isEmail && !isUsername) {
        throw new AppError(
          400,
          "Please enter a valid username or a valid email address",
        );
      }

      return true;
    }),
  ,
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isLength({ max: 100 })
    .withMessage("Password length must be between 6 and 100 characters"),
];

export default loginValidationRules;
