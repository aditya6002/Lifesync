import { body } from "express-validator";

const validProfessions = [
  "student",
  "professional",
  "freelancer",
  "entrepreneur",
  "retired",
  "unemployed",
  "artist",
  "content_creator",
  "researcher",
  "educator",
  "healthcare_worker",
  "engineer",
  "scientist",
  "developer",
  "designer",
  "writer",
  "musician",
  "athlete",
  "other",
];

const validGenders = ["male", "female", "other"];

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

const registerValidator = [
  // Name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("Name length must be between 3 and 80 characters")
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  // Username validation
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

  // Email validation
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

  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({ min: 6, max: 80 })
    .withMessage("Password length must be between 6 and 80 characters")
    .bail()
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  // Confirm password validation
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password cannot be empty")
    .bail()
    .isLength({ min: 6, max: 80 })
    .withMessage("Confirm Password length must be between 6 and 80 characters")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),

  // Profession validation
  body("profession")
    .trim()
    .notEmpty()
    .withMessage("Profession cannot be empty")
    .bail()
    .isIn(validProfessions)
    .withMessage(
      "Profession must be one of the following: " + validProfessions.join(", "),
    ),

  // Gender validation
  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender cannot be empty")
    .bail()
    .isIn(validGenders)
    .withMessage("Gender must be either male, female, or other"),
];

export default registerValidator;
