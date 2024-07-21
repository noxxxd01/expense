import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleDollarSign, HandCoins, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

//
import { useFetchBudgetsQuery } from "@/redux/api/budgets";
import { useEffect, useState } from "react";

const Overview = () => {
  const { data: budgets, refetch } = useFetchBudgetsQuery();
  const [latestBudgets, setLatestBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (budgets) {
      const allExpenses = budgets.flatMap((budget) =>
        budget.expenses.map((expense) => ({
          ...expense,
          budgetName: budget.name,
          budgetId: budget._id,
        }))
      );
      const sortedBudgets = [...allExpenses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setExpenses(sortedBudgets.slice(0, 10));
    }
  }, [budgets]);

  useEffect(() => {
    if (budgets) {
      const sortedBudgets = [...budgets].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestBudgets(sortedBudgets.slice(0, 4));
    }
  }, [budgets]);

  const totalBudget =
    budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
  const totalSpent =
    budgets
      ?.flatMap((budget) => budget.expenses)
      .reduce((sum, expense) => sum + expense.price, 0) || 0;
  const numberOfBudgets = budgets?.length || 0;

  const budgetChartData =
    budgets?.map((budget) => ({
      name: budget.name,
      amount: budget.amount,
      spent: budget.expenses.reduce((sum, expense) => sum + expense.price, 0),
    })) || [];

  const expenseByMonthData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.createdAt).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.amount += expense.price;
    } else {
      acc.push({ month, amount: expense.price });
    }
    return acc;
  }, []);

  return (
    <div className="p-10 h-[100vh]">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle>Overview</CardTitle>
          <CardDescription>Track your activity in one page</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-1.5">
                  <CardDescription>Total Budget</CardDescription>
                  <CardTitle>${totalBudget}</CardTitle>
                </div>
                <div>
                  <CircleDollarSign size={30} className="text-yellow-500" />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-1.5">
                  <CardDescription>Total Spend</CardDescription>
                  <CardTitle>${totalSpent}</CardTitle>
                </div>
                <div>
                  <HandCoins size={30} className="text-green-500" />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-1.5">
                  <CardDescription>No. of Budgets</CardDescription>
                  <CardTitle>{numberOfBudgets}</CardTitle>
                </div>
                <div>
                  <Wallet size={30} className="text-blue-500" />
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="grid grid-cols-1 xl:flex mt-8 gap-6">
            <div className="flex-grow xl:w-[23.6rem] w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>
                    Track your activity using charts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        fill="#2563eb"
                        name="Total Budget"
                      />
                      <Bar dataKey="spent" fill="#60a5fa" name="Total Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Expense by Month</CardTitle>
                  <CardDescription>
                    View your expenses distributed by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={expenseByMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#82ca9d"
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Latest Expenses</CardTitle>
                  <CardDescription>
                    History of latest expenses shown in the table
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      {expenses.map((expense) => (
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
            <div className="flex-1">
              {latestBudgets.map((data) => {
                const totalSpent =
                  data?.expenses?.reduce(
                    (total, expense) => total + expense.price,
                    0
                  ) || 0;
                const remainingAmount = data ? data.amount - totalSpent : 0;
                const progressValue = data
                  ? (totalSpent / data.amount) * 100
                  : 0;
                return (
                  <Link to={`/${data._id}`} key={data._id}>
                    <Card className="mb-4">
                      <CardHeader className="flex flex-row justify-between items-center">
                        <div className="flex flex-col space-y-1.5">
                          <CardDescription>
                            {data.name} | {data.expenses.length} items
                          </CardDescription>
                          <CardTitle>${data.amount}</CardTitle>
                        </div>
                        <Button variant="ghost">
                          <span className="text-2xl">{data.icon}</span>
                        </Button>
                      </CardHeader>
                      <CardFooter className="flex flex-col space-y-1 pt-4">
                        <div className="w-full flex items-center justify-between">
                          <CardDescription>${totalSpent} Spend</CardDescription>
                          <CardDescription>
                            ${remainingAmount} Remaining
                          </CardDescription>
                        </div>
                        <Progress value={progressValue} className="w-full" />
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
