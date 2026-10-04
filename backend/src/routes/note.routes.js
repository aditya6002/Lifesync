import { Router } from "express";

import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import validator from "../middleware/validate.middleware.js";

import journalRateLimiter from "../middleware/features/journalRateLimiter.middleware.js";
import createJournalValidator from "../utils/journal/createJournal.validator.js";
import getJournalValidator from "../utils/journal/getJournal.validator.js";
const noteRateLimiter = journalRateLimiter;
const createNoteValidator = createJournalValidator;
const getNoteValidator = getJournalValidator;

// import all controllers
import noteController from "../controllers/note.controller.js";

const routes = new Router();

routes
  .route("/")
  .get(noteRateLimiter, isUserLogin, wrapAsync(noteController.getAll))
  .post(
    noteRateLimiter,
    isUserLogin,
    createNoteValidator,
    validator,
    wrapAsync(noteController.addNote),
  );

routes
  .route("/:noteId")
  .get(
    noteRateLimiter,
    isUserLogin,
    getNoteValidator,
    validator,
    wrapAsync(noteController.getNote),
  )
  .patch(
    noteRateLimiter,
    isUserLogin,
    createNoteValidator,
    validator,
    wrapAsync(noteController.editNote),
  )
  .delete(
    noteRateLimiter,
    isUserLogin,
    getNoteValidator,
    validator,
    wrapAsync(noteController.deleteNote),
  );

export default routes;
