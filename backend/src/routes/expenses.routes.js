const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const expensesController = require("../controllers/expenses.controller.js");
const expenseValidationRules = require("../middleware/expenseValidation.middleware.js");

router
  .route("/")
  /**
   * @method POST /api/expenses
   * @description Create new expense
   * @body {}
   */
  .post(
    isUserLogin,
    expenseValidationRules.createRules,
    wrapAsync(expensesController.createExpense),
  );

/**
 * @method DELETE /api/expenses/:expenseId
 * @description Delete expense
 */
router
  .route("/:expenseId")

  /**
   * @method PUT /api/expenses
   * @description Edit expense
   * @body {}
   */
  .put(
    isUserLogin,
    expenseValidationRules.editRules,
    wrapAsync(expensesController.editExpense),
  )
  .delete(
    isUserLogin,
    expenseValidationRules.deleteRules,
    wrapAsync(expensesController.deleteExpense),
  );

/**
 * @method GET /api/expenses/:year/:month
 * @description Get expense using year and month
 */
router.get(
  "/:year/:month/",
  isUserLogin,
  expenseValidationRules.getAllRules,
  wrapAsync(expensesController.getDataByMonth),
);

module.exports = router;
