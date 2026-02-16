const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.js");
const expensesController = require("../controllers/expenses.controller.js");

router
  .route("/")
  .get(isUserLogin, wrapAsync(expensesController.getAllNotes))
  .post(isUserLogin, wrapAsync(expensesController.createExpense));

router.get(
  "/history/:year/:month",
  isUserLogin,
  wrapAsync(expensesController.getDataByMonth),
);

module.exports = router;
