const express = require("express");
const noteController = require("../controllers/notes.controller");
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync.middleware");
const noteValidationRules = require("../middleware/noteValidation.middleware");
const logActivity = require("../middleware/activityLogger.middleware");

const router = express.Router();
// Create and edit route
router
  .route("/")
  .post(
    isUserLogin,
    noteValidationRules.createRules,
    logActivity("journal", "created"),
    wrapAsync(noteController.createNote),
  )
  .put(
    isUserLogin,
    noteValidationRules.editRules,
    wrapAsync(noteController.editNote),
  );

// Delete route
router.delete(
  "/:noteId",
  isUserLogin,
  noteValidationRules.deleteRules,
  wrapAsync(noteController.deleteNote),
);

// Get route
router.get(
  "/:skip/:limit",
  isUserLogin,
  noteValidationRules.getRules,
  wrapAsync(noteController.getAllNotes),
);

module.exports = router;
