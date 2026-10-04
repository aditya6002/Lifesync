import { Router } from "express";

import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import validator from "../middleware/validate.middleware.js";
import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";

// Import all utils/validators
import createJournalValidator from "../utils/journal/createJournal.validator.js";
import { getJournalValidator } from "../utils/mongooseId.validator.js";

// import all controllers
import journalController from "../controllers/journal.controller.js";

const routes = new Router();

// Add routes
routes
  .route("/")
  .get(featureRateLimiter, isUserLogin, wrapAsync(journalController.getAll))
  .post(
    featureRateLimiter,
    isUserLogin,
    createJournalValidator,
    validator,
    wrapAsync(journalController.addJournal),
  );

routes
  .route("/:journalId")
  .get(
    featureRateLimiter,
    isUserLogin,
    getJournalValidator,
    validator,
    wrapAsync(journalController.getJournal),
  )
  .patch(
    featureRateLimiter,
    isUserLogin,
    createJournalValidator,
    validator,
    wrapAsync(journalController.editJournal),
  )
  .delete(
    featureRateLimiter,
    isUserLogin,
    getJournalValidator,
    validator,
    wrapAsync(journalController.deleteJournal),
  );

export default routes;
