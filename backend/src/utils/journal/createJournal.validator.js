import { body } from "express-validator";

const createJournalValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage('Please provide a title for the journal')
    .bail()
    .isLength({ min: 1 })
    .withMessage('Title must be at least 1 character long')
    .isLength({ max: 120 })
    .withMessage('Title must be at most 120 characters long'),
  body("content")
    .trim()
    .notEmpty()
    .withMessage('Please provide content for the journal')
    .bail()
    .isLength({ min: 1 })
    .withMessage('Content must be at least 1 character long'),
];

export default createJournalValidator;
