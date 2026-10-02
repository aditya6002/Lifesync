import { body, query } from "express-validator";

const resetPasswordValidator = [
  query("token")
    .trim()
    .notEmpty()
    .withMessage("Token cannot be empty")
    .bail(),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .isLength({ max: 100 })
    .withMessage("New password must be at most 100 characters long")
    .custom((value, { req }) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error(
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        );
      }
      return true;
    }),
  body("confirmNewPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm new password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Confirm new password must be at least 6 characters long")
    .isLength({ max: 100 })
    .withMessage("Confirm new password must be at most 100 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm new password does not match new password");
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error(
          "Confirm new password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        );
      }
      return true;
    }),
];

export default resetPasswordValidator;
