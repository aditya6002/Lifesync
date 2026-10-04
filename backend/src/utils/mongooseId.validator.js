import { param } from "express-validator";

const getJournalValidator = [
  param("journalId")
    .isMongoId()
    .withMessage("Please provide a valid journalId"),
];

const getNoteValidator = [
  param("noteId").isMongoId().withMessage("Please provide a valid note id"),
];
const getTaskValidator = [
  param("taskId").isMongoId().withMessage("Please provide a valid task id"),
];

export { getJournalValidator, getNoteValidator, getTaskValidator };
