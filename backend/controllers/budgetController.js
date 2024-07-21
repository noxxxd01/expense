import Budget from "../models/Budget.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createBudget = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, icon, amount, expenses } = req.body;
    const newBudget = new Budget({
      name,
      icon,
      amount,
      expenses,
      user: userId,
    });

    const savedBudget = await newBudget.save();
    res.status(200).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: "Error creating budget", error });
  }
});

const addExpense = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;
  const { name, price } = req.body;

  try {
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const newExpense = {
      name,
      price,
    };

    budget.expenses.push(newExpense);
    await budget.save();

    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error adding expense", error });
  }
});

const deleteExpense = asyncHandler(async (req, res) => {
  try {
    const { budgetId, expenseId } = req.params;

    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const expenseIndex = budget.expenses.findIndex(
      (expense) => expense._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    budget.expenses.splice(expenseIndex, 1);
    await budget.save();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting expense", error });
  }
});

const getBudgets = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const budgets = await Budget.find({ user: userId });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ message: "Error fetching budgets", error });
  }
});

const updateBudget = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { budgetId } = req.params;
    const updates = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      updates,
      { new: true }
    );

    if (!budget) {
      return res.status(400).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error updating budget", error });
  }
});

const deleteBudget = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { budgetId } = req.params;

    const result = await Budget.deleteOne({ _id: budgetId, user: userId });

    if (result.deletedCount == 0) {
      return res.status(400).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting budget", error });
  }
});

const getSingleBudget = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { budgetId } = req.params;

    const result = await Budget.findOne({ _id: budgetId, user: userId });

    if (!result) {
      return res.status(400).json({ message: "Budget not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error fetching budget", error });
  }
});

export {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getSingleBudget,
  addExpense,
  deleteExpense,
};
