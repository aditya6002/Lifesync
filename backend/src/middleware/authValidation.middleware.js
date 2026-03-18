const { body, param, validationResult } = require("express-validator");
const AppError = require("./errors.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.message || "Validation error";
    return res
      .status(400)
      .json({ message, code: "VALIDATOR_ERROR", detail: "Validator error" });
  }
  next();
};

const registerValidationRules = [
  body("name")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30"),
  body("username")
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 6, max: 25 })
    .withMessage("Username must be between 6 and 25 characters"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 6 }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 to 25 characters"),
  validateResult,
];

const loginValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 6 }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 to 25 characters"),
  validateResult,
];

const changePassWordValidationRules = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 letters"),
  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8 })
    .withMessage("New Password must be 8 letters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm Password must be 8 letters"),
  validateResult,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  changePassWordValidationRules,
};
