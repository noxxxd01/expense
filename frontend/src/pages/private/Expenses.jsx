import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//
import { useFetchBudgetsQuery } from "@/redux/api/budgets";
import { useEffect, useState } from "react";

const Expenses = () => {
  const { data: budgets, refetch } = useFetchBudgetsQuery();
  const [expenses, setExpenses] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("all");

  useEffect(() => {
    if (budgets) {
      const allExpenses = budgets.flatMap((budget) =>
        budget.expenses.map((expense) => ({
          ...expense,
          budgetName: budget.name,
          budgetId: budget._id,
        }))
      );
      setExpenses(allExpenses);
    }
  }, [budgets]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredExpenses =
    selectedBudget === "all"
      ? expenses
      : expenses.filter((expense) => expense.budgetId === selectedBudget);

  return (
    <div className="p-10 h-[100vh]">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle>Expense History</CardTitle>
          <CardDescription>View all of your expenses in a list</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-0 mt-8">
          <div className="mb-4 flex justify-end">
            <Select
              value={selectedBudget}
              onValueChange={(value) => setSelectedBudget(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Budgets</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  {budgets?.map((budget) => (
                    <SelectItem value={budget._id} key={budget._id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense name</TableHead>
                <TableHead>Expense price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>CreatedAt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>${expense.price}</TableCell>
                  <TableCell>{expense.budgetName}</TableCell>
                  <TableCell>
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
