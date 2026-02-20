const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const tasksControllers = require("../controllers/tasks.controller.js");
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const router = express.Router();
const taskValidationRules = require("../middleware/taskValidation.middleware.js");

// Create and edit route
router
  .route("/")
  .post(
    isUserLogin,
    taskValidationRules.createRules,
    wrapAsync(tasksControllers.addNewTask),
  )
  .put(
    isUserLogin,
    taskValidationRules.editRules,
    wrapAsync(tasksControllers.editTask),
  );

// Delete route
router.delete(
  "/:taskId",
  isUserLogin,
  taskValidationRules.deleteRules,
  wrapAsync(tasksControllers.deleteTask),
);

// Get route
router.get(
  "/:skip/:limit",
  isUserLogin,
  taskValidationRules.getRules,
  wrapAsync(tasksControllers.getAllTasks),
);

module.exports = router;
