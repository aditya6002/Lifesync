const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const expensesController = require("../controllers/expenses.controller.js");

router
  .route("/")

  .post(isUserLogin, wrapAsync(expensesController.createExpense))
  .put(isUserLogin, wrapAsync(expensesController.editExpense))
  

router.delete("/:expenseId",isUserLogin,wrapAsync(expensesController.deleteExpense))

router.get(
  "/:year/:month/:skip/:limit",
  isUserLogin,
  wrapAsync(expensesController.getDataByMonth),
);

module.exports = router;
