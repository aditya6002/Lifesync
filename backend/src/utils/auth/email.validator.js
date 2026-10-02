import { body } from "express-validator";


const emailValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("Email is not valid")
    .bail()
    .isLength({ min: 4, max: 80 })
    .withMessage("Email length must be between 4 and 80 characters")
    .normalizeEmail(),
];

export default emailValidation;
