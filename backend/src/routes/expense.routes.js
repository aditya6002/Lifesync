import { Router } from "express";
import expenseController from "../controllers/expense.controller.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";

const router = Router();

router.use(featureRateLimiter, isUserLogin);

router
  .route("/")
  .get(wrapAsync(expenseController.getAllExpenses))
  .post(wrapAsync(expenseController.addExpense));

router
  .route("/summary")
  .get(wrapAsync(expenseController.getExpenseSummary));

router
  .route("/:expenseId")
  .get(wrapAsync(expenseController.getExpenseById))
  .put(wrapAsync(expenseController.editExpense))
  .delete(wrapAsync(expenseController.deleteExpense));

export default router;
