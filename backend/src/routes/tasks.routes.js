const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const tasksControllers = require("../controllers/tasks.controller.js");
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const router = express.Router();

// Create and edit route
router
  .route("/")
  .post(isUserLogin, wrapAsync(tasksControllers.addNewTask))
  .put(isUserLogin, wrapAsync(tasksControllers.editTask));

// Delete route
router.delete("/:taskId", isUserLogin, wrapAsync(tasksControllers.deleteTask));

// Get route
router.get(
  "/:skip/:limit",
  isUserLogin,
  wrapAsync(tasksControllers.getAllTasks),
);

module.exports = router;
