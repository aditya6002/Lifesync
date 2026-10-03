import { body } from "express-validator";

const activeAccountValidator = [
  body("loginId")
    .notEmpty()
    .withMessage("Login ID is required")
    .isString()
    .withMessage("Login ID must be a string")
    .custom((value) => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;

      if (!emailRegex.test(value) && !usernameRegex.test(value)) {
        throw new Error(
          "Login ID must be a valid email address or username (3-50 characters, letters, numbers, underscores, hyphens)",
        );
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isLength({ max: 100 })
    .withMessage("Password must not exceed 100 characters long")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    ),
];

export default activeAccountValidator;
