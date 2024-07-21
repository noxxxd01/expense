import express from "express";
import authenticate from "../middlewares/authMiddleware.js";

// Controllers
import {
  addExpense,
  createBudget,
  deleteBudget,
  deleteExpense,
  getBudgets,
  getSingleBudget,
  updateBudget,
} from "../controllers/budgetController.js";

const router = express.Router();

//
router.route("/create-budget").post(authenticate, createBudget);
router.route("/:budgetId/expenses").post(authenticate, addExpense);
router
  .route("/:budgetId/expenses/:expenseId")
  .delete(authenticate, deleteExpense);
router.route("/fetch-budgets").get(authenticate, getBudgets);
router.route("/fetch-budgets/:budgetId").get(authenticate, getSingleBudget);
router.route("/:budgetId").put(authenticate, updateBudget);
router.route("/:budgetId").delete(authenticate, deleteBudget);

export default router;
