const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const expensesController = require("../controllers/expenses.controller.js");
const expenseValidationRules = require("../middleware/expenseValidation.middleware.js");

router
  .route("/")

  .post(
    isUserLogin,
    expenseValidationRules.createRules,
    wrapAsync(expensesController.createExpense),
  )
  .put(
    isUserLogin,
    expenseValidationRules.editRules,
    wrapAsync(expensesController.editExpense),
  );

router.delete(
  "/:expenseId",
  isUserLogin,
  expenseValidationRules.deleteRules,
  wrapAsync(expensesController.deleteExpense),
);

router.get(
  "/:year/:month/:skip/:limit",
  isUserLogin,
  expenseValidationRules.getAllRules,
  wrapAsync(expensesController.getDataByMonth),
);

module.exports = router;
