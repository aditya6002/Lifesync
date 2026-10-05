import { param, query } from "express-validator";

const getJournalValidator = [
  param("journalId")
    .isMongoId()
    .withMessage("Please provide a valid journalId"),
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Please provide a valid skip value"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Please provide a valid limit value between 1 and 100"),
];

const getNoteValidator = [
  param("noteId").isMongoId().withMessage("Please provide a valid note id"),
];
const getTaskValidator = [
  param("taskId").isMongoId().withMessage("Please provide a valid task id"),
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Please provide a valid skip value"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Please provide a valid limit value between 1 and 100"),
];

const getExpensesValidator = [
  param("expenseId").isMongoId().withMessage("Please provide a valid task id"),
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Please provide a valid skip value"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Please provide a valid limit value between 1 and 100"),
];

const expenseHistoryValidator = [
  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Please provide a valid month between 1 and 12"),
  query("year")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      `Please provide a valid year between 1900 and ${new Date().getFullYear()}`,
    ),
];

export {
  getJournalValidator,
  getNoteValidator,
  getTaskValidator,
  expenseHistoryValidator,
  getExpensesValidator,
};
