const { body, param, validationResult } = require("express-validator");
const AppError = require("./errors.middleware");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.errors[0].msg || "Server error";
    throw new AppError(msg, 400);
  }
  next();
};

const createNoteValidationRules = [
  body("title")
    .isString()
    .withMessage("Invalid  title")
    .isLength({ min: 5, max: 60 })
    .withMessage("Invalid title"),
  body("content")
    .isString()
    .withMessage("Invalid content")
    .isLength({ min: 1 })
    .withMessage("Invalid content"),
  validateResult,
];

const editNoteValidationRules = [
  body("note.userId")
    .notEmpty()
    .withMessage("UserId is required")
    .isMongoId()
    .withMessage("Invalid UserId"),

  body("note.title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("note.content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),

  validateResult,
];

const getAllNoteValidationRules = [
  param("skip").notEmpty().withMessage("Skip is required"),
  param("limit").notEmpty().withMessage("Limit is required"),
  validateResult,
];

const deleteNoteValidationRules = [
  param("noteId")
    .notEmpty()
    .withMessage("Note id is required")
    .isMongoId()
    .withMessage("Wrong journal id"),
  validateResult,
];

module.exports = {
  createRules: createNoteValidationRules,
  editRules: editNoteValidationRules,
  getRules: getAllNoteValidationRules,
  deleteRules: deleteNoteValidationRules,
};
