const express = require("express");
const noteController = require("../controllers/notes.controller");
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync.middleware");

const router = express.Router();
// Create and edit route
router
  .route("/")
  .post(isUserLogin, wrapAsync(noteController.createNote))
  .put(isUserLogin, wrapAsync(noteController.editNote));

// Delete route
router.delete("/:noteId", isUserLogin, wrapAsync(noteController.deleteNote));

// Get route
router.get("/:skip/:limit", isUserLogin, wrapAsync(noteController.getAllNotes));

module.exports = router;
