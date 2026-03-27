const express = require("express");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.middleware");
const { isUserLogin } = require("../middleware/auth.middleware");
const journalController = require("../controllers/journal.controller");
const journalValidator = require("../middleware/journalValidation.middleware");

// Create and Edit Journal Route
router
  .route("/")
  .post(
    isUserLogin,
    journalValidator.createRules,
    wrapAsync(journalController.newJouranl),
  )
  .put(
    isUserLogin,
    journalValidator.editRules,
    wrapAsync(journalController.editJournal),
  );

// Delete Journal route
router.delete(
  "/:journalId",
  isUserLogin,
  journalValidator.deleteRules,
  wrapAsync(journalController.deleteJournal),
);

// Get Journals
router.get(
  "/:year/:month",
  isUserLogin,
  journalValidator.getRules,
  wrapAsync(journalController.getData),
);

module.exports = router;
