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

const editProfileValidator = [
  // Name validation
  body("name")
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
    .notEmpty()
    .withMessage("Username cannot be empty")
    .bail()
    .isLength({ min: 4, max: 80 })
    .withMessage("Username length must be between 4 and 80 characters")
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  // Gender validation
  body("gender")
    .notEmpty()
    .withMessage("Gender cannot be empty")
    .bail()
    .isIn(validGenders)
    .withMessage(
      `Gender must be one of the following: ${validGenders.join(", ")}`,
    ),

  body("email")
    .notEmpty()
    .trim()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .custom((value, { req }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error("Please provide a valid email address");
      }
      return true;
    }),

  // Profession validation
  body("profession")
    .notEmpty()
    .trim()
    .withMessage("Profession cannot be empty")
    .bail()
    .isIn(validProfessions)
    .withMessage(
      `Profession must be one of the following: ${validProfessions.join(", ")}`,
    ),

  // Bio validation
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio length must not exceed 500 characters"),

  // Goal validation
  body("goal")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Goal length must not exceed 500 characters"),

  // App Language validation
  body("appLanguage")
    .notEmpty()
    .withMessage("App language cannot be empty")
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage("App language length must be between 2 and 10 characters"),
  body("profilePic")
    .optional()
    .trim()
    .isURL()
    .withMessage("Profile picture must be a valid URL"),
];

export default editProfileValidator;
