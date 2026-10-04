import { Router } from "express";

import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import validator from "../middleware/validate.middleware.js";
import journalRateLimiter from "../middleware/features/journalRateLimiter.middleware.js";

// Import all utils/validators
import createJournalValidator from "../utils/journal/createJournal.validator.js";
import getJournalValidator from "../utils/journal/getJournal.validator.js";

// import all controllers
import journalController from "../controllers/journal.controller.js";

const routes = new Router();

// Add routes
routes
  .route("/")
  .get(journalRateLimiter, isUserLogin, wrapAsync(journalController.getAll))
  .post(
    journalRateLimiter,
    isUserLogin,
    createJournalValidator,
    validator,
    wrapAsync(journalController.addJournal),
  );

routes
  .route("/:journalId")
  .get(
    journalRateLimiter,
    isUserLogin,
    getJournalValidator,
    validator,
    wrapAsync(journalController.getJournal),
  )
  .patch(
    journalRateLimiter,
    isUserLogin,
    createJournalValidator,
    validator,
    wrapAsync(journalController.editJournal),
  )
  .delete(
    journalRateLimiter,
    isUserLogin,
    getJournalValidator,
    validator,
    wrapAsync(journalController.deleteJournal),
  );

export default routes;
