import { apiSlice } from "./apiSlice";
import { BUDGET_URL } from "../constants";

export const budgetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBudgets: builder.query({
      query: () => `${BUDGET_URL}/fetch-budgets`,
    }),

    fetchBudget: builder.query({
      query: (id) => `${BUDGET_URL}/fetch-budgets/${id}`,
    }),

    addExpense: builder.mutation({
      query: ({ id, expense }) => ({
        url: `${BUDGET_URL}/${id}/expenses`,
        method: "POST",
        body: expense,
      }),
    }),

    deleteExpense: builder.mutation({
      query: ({ budgetId, expenseId }) => ({
        url: `${BUDGET_URL}/${budgetId}/expenses/${expenseId}`,
        method: "DELETE",
      }),
    }),

    deleteBudget: builder.mutation({
      query: (budgetId) => ({
        url: `${BUDGET_URL}/${budgetId}`,
        method: "DELETE",
      }),
    }),

    addBudget: builder.mutation({
      query: (data) => ({
        url: `${BUDGET_URL}/create-budget`,
        method: "POST",
        body: data,
      }),
    }),

    updateBudget: builder.mutation({
      query: ({ budgetId, data }) => ({
        url: `${BUDGET_URL}/${budgetId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchBudgetsQuery,
  useFetchBudgetQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useDeleteBudgetMutation,
  useAddBudgetMutation,
  useUpdateBudgetMutation,
} = budgetApiSlice;
