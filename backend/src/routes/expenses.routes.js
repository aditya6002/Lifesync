import { Router } from "express";
const routes = new Router();

import expensesController from "../controllers/expenses.controller.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import validator from "../middleware/validate.middleware.js";
import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";

import expenseFormValidator from "../utils/expense/expenseForm.validator.js";
import {
  expenseHistoryValidator,
  getExpensesValidator,
} from "../utils/mongooseId.validator.js";

routes
  .route("/")
  .get(featureRateLimiter, isUserLogin, wrapAsync(expensesController.getAll))
  .post(
    featureRateLimiter,
    isUserLogin,
    expenseFormValidator,
    validator,
    wrapAsync(expensesController.addExpense),
  );

routes.get(
  "/history",
  featureRateLimiter,
  isUserLogin,
  expenseHistoryValidator,
  validator,
  wrapAsync(expensesController.historyExpenses),
);

routes
  .route("/:expenseId")
  .get(
    featureRateLimiter,
    isUserLogin,
    getExpensesValidator,
    validator,
    wrapAsync(expensesController.getExpense),
  )
  .patch(
    featureRateLimiter,
    isUserLogin,
    getExpensesValidator,
    expenseFormValidator,
    validator,
    wrapAsync(expensesController.editExpense),
  )
  .delete(
    featureRateLimiter,
    isUserLogin,
    getExpensesValidator,
    validator,
    wrapAsync(expensesController.deleteExpense),
  );

export default routes;
