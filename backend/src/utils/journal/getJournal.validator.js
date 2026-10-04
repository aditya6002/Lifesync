import { param } from "express-validator";

const getJournalValidator = [
  param("journalId")
    .isMongoId()
    .withMessage("Please provide a valid journalId"),
];

export default getJournalValidator;
