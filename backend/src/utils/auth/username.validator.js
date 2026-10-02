import { body } from "express-validator";

const usernameValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .bail()
    .isLength({ min: 4, max: 80 })
    .withMessage("Username length must be between 4 and 80 characters")
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
];

export default usernameValidator;
