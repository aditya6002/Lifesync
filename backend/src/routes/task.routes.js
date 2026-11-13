import { Router } from "express";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import taskController from "../controllers/task.controller.js";

const router = new Router();

router
  .route("/")
  .get(isUserLogin, wrapAsync(taskController.getAllTasks))
  .post(isUserLogin, wrapAsync(taskController.createTask));

router
  .route("/clear-completed")
  .delete(isUserLogin, wrapAsync(taskController.clearCompleted));

router
  .route("/:taskId")
  .patch(isUserLogin, wrapAsync(taskController.updateTask))
  .delete(isUserLogin, wrapAsync(taskController.deleteTask));

export default router;
