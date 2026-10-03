import { body } from "express-validator";

const passwordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Password must not exceed 100 characters long")
    .custom((value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasUpperCase) {
        throw new Error("Password must contain at least one uppercase letter");
      }
      if (!hasLowerCase) {
        throw new Error("Password must contain at least one lowercase letter");
      }
      if (!hasNumber) {
        throw new Error("Password must contain at least one number");
      }
      if (!hasSpecialChar) {
        throw new Error("Password must contain at least one special character");
      }

      return true;
    }),
];


export default passwordValidator;