import { body } from "express-validator";

const otpValidator = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP cannot be empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .bail()
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain only digits"),
];

export default otpValidator;
