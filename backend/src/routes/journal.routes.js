const express = require("express");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.middleware");
const { isUserLogin } = require("../middleware/auth.middleware");
const journalController = require("../controllers/journal.controller");
const {
  journalValidationRules,
} = require("../middleware/validation.middleware");

// Create and Edit Journal Route
router
  .route("/")
  .post(
    isUserLogin,
    journalValidationRules,
    wrapAsync(journalController.newJouranl),
  )
  .put(
    isUserLogin,

    wrapAsync(journalController.editJournal),
  );

// Delete Journal route
router.delete(
  "/:journalId",
  isUserLogin,
  wrapAsync(journalController.deleteJournal),
);

// Get Journals
router.get("/:skip/:limit", isUserLogin, wrapAsync(journalController.getData));

module.exports = router;
