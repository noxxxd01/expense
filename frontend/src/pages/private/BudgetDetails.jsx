import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, SmilePlus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

//
import {
  useFetchBudgetQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
} from "@/redux/api/budgets";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const BudgetDetails = () => {
  const { id } = useParams();
  const { data: budgets, refetch } = useFetchBudgetQuery(id);
  const [addExpense, { isLoading }] = useAddExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [updatedName, setUpdatedName] = useState("");
  const [updateAmount, setUpdatedAmout] = useState("");
  const [updateEmoji, setUpdatedEmoji] = useState(null);

  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const handleUpdateBudget = async () => {
    if (!updatedName || !updateAmount || !updateEmoji) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "All fields are required",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      try {
        await updateBudget({
          budgetId: id,
          data: {
            name: updatedName,
            amount: parseFloat(updateAmount),
            icon: updateEmoji,
          },
        }).unwrap();
        refetch();
        setUpdatedName("");
        setUpdatedAmout("");
        setUpdatedEmoji(null);

        const currentTime = new Date().toLocaleString();
        toast({
          title: "Budget successfully updated",
          description: `Budget updated at ${currentTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });

        setIsOpenUpdate(false);
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update budget",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteBudget(budgetId).unwrap();
      refetch();
      navigate("/budget");

      const currentTime = new Date().toLocaleString();
      toast({
        title: "Budget successfully deleted",
        description: `Budget deleted at ${currentTime}`,
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete budget",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleAddExpenses = async () => {
    const expenseAmount = parseFloat(price);

    if (name && price) {
      if (totalSpent + expenseAmount > budgets.amount) {
        toast({
          variant: "destructive",
          title: "Budget Limit Exceeded",
          description: "The total expenses cannot exceed the budget amount.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }

      try {
        await addExpense({
          id,
          expense: { name, price: parseFloat(price) },
        });

        refetch();
        setName("");
        setPrice("");

        const currentTime = new Date().toLocaleString();
        toast({
          title: "Expense successfully added",
          description: `Expense created at ${currentTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add expense",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "All fields are required",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense({ budgetId: id, expenseId }).unwrap();
      refetch();

      const currentTime = new Date().toLocaleString();
      toast({
        title: "Expense successfully deleted",
        description: `Expense deleted at ${currentTime}`,
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete expense",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const totalSpent =
    budgets?.expenses?.reduce((total, expense) => total + expense.price, 0) ||
    0;
  const remainingAmount = budgets ? budgets.amount - totalSpent : 0;
  const progressValue = budgets ? (totalSpent / budgets.amount) * 100 : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsOpenUpdate(false);
    setUpdatedEmoji(null);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleEmojiSelect = (selectedEmoji) => {
    setUpdatedEmoji(selectedEmoji.native);
    setIsVisible(false);
  };

  useEffect(() => {
    if (budgets) {
      setUpdatedName(budgets.name || "");
      setUpdatedAmout(budgets.amount || "");
      setUpdatedEmoji(budgets.icon || "");
    }
  }, [budgets]);
  return (
    <div className="p-10 h-[100vh]">
      <Card className="border-none shadow-none">
        <Link to="/budget">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <CardHeader className="px-0 flex flex-col gap-y-3 md:items-center md:flex-row justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>My Expenses</CardTitle>
            <CardDescription>
              You can manage your expenses and also delete the budget
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Dialog open={isOpenUpdate} onOpenChange={setIsOpenUpdate}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <SquarePen className="mr-2 h-4 w-4" /> Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update your budget!</DialogTitle>
                  <DialogDescription>
                    You can update your budget. Click update after you are
                    finished.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budgetName" className="text-right">
                      Budget Name
                    </Label>
                    <Input
                      id="budgetName"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={updateAmount}
                      onChange={(e) => setUpdatedAmout(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 relative">
                    <Label htmlFor="icon" className="text-right text-xl">
                      {updateEmoji || <span className="text-sm">Icon</span>}
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      id="icon"
                      onClick={toggleVisibility}
                    >
                      <SmilePlus size={18} />
                    </Button>
                  </div>
                  <div
                    className={`flex justify-center ${
                      isVisible ? "block" : "hidden"
                    }`}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      value={setUpdatedEmoji}
                      onChange={(e) => setUpdatedEmoji(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancelUpdate}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateBudget}>
                    {isUpdating ? "Loading..." : "Update"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure to delete this budget?</DialogTitle>
                  <DialogDescription>
                    Deleting the budget can be a significant and irreversible
                    action.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-y-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBudget(id)}
                  >
                    {isDeleting ? "Loading..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="px-0 grid grid-cols-1 md:grid-cols-2 my-6 gap-8">
          <Card className="mb-auto">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-col space-y-1.5">
                <CardDescription>
                  {budgets?.name} | {budgets?.expenses?.length} items
                </CardDescription>
                <CardTitle>${budgets?.amount}</CardTitle>
              </div>
              <Button variant="ghost">
                <span className="text-2xl">{budgets?.icon}</span>
              </Button>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-1 pt-4">
              <div className="w-full flex items-center justify-between">
                <CardDescription>${totalSpent} Spend</CardDescription>
                <CardDescription>${remainingAmount} Remaining</CardDescription>
              </div>
              <Progress value={progressValue} className="w-full" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Add as many as you want</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Expense name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Expense price</Label>
                <Input
                  type="text"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full" onClick={handleAddExpenses}>
                {isLoading ? "Loading..." : "Add New Expense"}
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
        <CardFooter>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense name</TableHead>
                <TableHead>Expense price</TableHead>
                <TableHead>CreatedAt</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets?.expenses?.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>${expense.price}</TableCell>
                  <TableCell>
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetDetails;
