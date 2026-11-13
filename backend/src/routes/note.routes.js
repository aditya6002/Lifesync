import { Router } from "express";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import noteController from "../controllers/note.controller.js";

const router = new Router();

router
  .route("/")
  .get(isUserLogin, wrapAsync(noteController.getAllNotes))
  .post(isUserLogin, wrapAsync(noteController.createNote));

router
  .route("/:noteId")
  .patch(isUserLogin, wrapAsync(noteController.updateNote))
  .delete(isUserLogin, wrapAsync(noteController.deleteNote));

export default router;
