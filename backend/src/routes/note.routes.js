import { Router } from "express";

import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import validator from "../middleware/validate.middleware.js";

import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";
import createJournalValidator from "../utils/journal/createJournal.validator.js";
import { getNoteValidator } from "../utils/mongooseId.validator.js";
const createNoteValidator = createJournalValidator;

// import all controllers
import noteController from "../controllers/note.controller.js";

const routes = new Router();

routes
  .route("/")
  .get(featureRateLimiter, isUserLogin, wrapAsync(noteController.getAll))
  .post(
    featureRateLimiter,
    isUserLogin,
    createNoteValidator,
    validator,
    wrapAsync(noteController.addNote),
  );

routes
  .route("/:noteId")
  .get(
    featureRateLimiter,
    isUserLogin,
    getNoteValidator,
    validator,
    wrapAsync(noteController.getNote),
  )
  .patch(
    featureRateLimiter,
    isUserLogin,
    createNoteValidator,
    validator,
    wrapAsync(noteController.editNote),
  )
  .delete(
    featureRateLimiter,
    isUserLogin,
    getNoteValidator,
    validator,
    wrapAsync(noteController.deleteNote),
  );

export default routes;
