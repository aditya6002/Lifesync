import { Router } from "express";

import taskController from "../controllers/task.controller.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import validator from "../middleware/validate.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";
import taskFormValidator from "../utils/task/taskForm.validator.js";
import { getTaskValidator } from "../utils/mongooseId.validator.js";
const routes = new Router();

routes
  .route("/")
  .get(featureRateLimiter, isUserLogin, wrapAsync(taskController.getAll))
  .post(
    featureRateLimiter,
    isUserLogin,
    taskFormValidator,
    validator,
    wrapAsync(taskController.addTask),
  );

routes
  .route("/:taskId")
  .get(
    featureRateLimiter,
    isUserLogin,
    getTaskValidator,
    validator,
    wrapAsync(taskController.getTask),
  )
  .put(
    featureRateLimiter,
    isUserLogin,
    taskFormValidator,
    getTaskValidator,
    validator,
    wrapAsync(taskController.editTask),
  )
  .patch(
    featureRateLimiter,
    getTaskValidator,
    isUserLogin,
    validator,
    wrapAsync(taskController.toggleTask),
  )
  .delete(
    featureRateLimiter,
    isUserLogin,
    getTaskValidator,
    validator,
    wrapAsync(taskController.deleteTask),
  );

export default routes;
