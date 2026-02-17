const express = require("express");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync");
const { isUserLogin } = require("../middleware/auth.middleware");
const journalController = require("../controllers/journal.controller");

// Create new Journal
router
  .route("/")

  .post(isUserLogin, wrapAsync(journalController.newJouranl))
  .put(isUserLogin, wrapAsync(journalController.editJournal));

router.delete(
  "/:journalId",
  isUserLogin,
  wrapAsync(journalController.deleteJournal),
);
router.get("/:skip/:limit", isUserLogin, wrapAsync(journalController.getData));

module.exports = router;
