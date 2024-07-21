/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SmilePlus, SquarePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

//
import {
  useFetchBudgetsQuery,
  useAddBudgetMutation,
} from "@/redux/api/budgets";

const Budgets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // fetch
  const { data: budgets, refetch } = useFetchBudgetsQuery();
  const [addBudget, { isLoading: isAdding }] = useAddBudgetMutation();

  const handleAddBudget = async () => {
    if (!name || !amount || !emoji) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "All fields are required",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      try {
        await addBudget({ name, amount, icon: emoji }).unwrap();
        refetch();
        setName("");
        setAmount("");
        setEmoji(null);

        const currentTime = new Date().toLocaleString();
        toast({
          title: "Budget successfully added",
          description: `Budget added at ${currentTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });

        setIsOpen(false);
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add budget",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEmoji(null);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleEmojiSelect = (selectedEmoji) => {
    setEmoji(selectedEmoji.native);
    setIsVisible(false);
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="p-10 h-[100vh]">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle>Budgets</CardTitle>
          <CardDescription>
            Manage your expenses and set budgets preferences
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-0">
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardDescription>Create budget category</CardDescription>
                <CardTitle>Budget</CardTitle>
              </CardHeader>
              <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)}>
                      <SquarePlus className="mr-2 h-4 w-4" /> Create budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create budget</DialogTitle>
                      <DialogDescription>
                        Create your budget here. Click create when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="budgetName" className="text-right">
                          Budget Name
                        </Label>
                        <Input
                          id="budgetName"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 relative">
                        <Label htmlFor="icon" className="text-right text-xl">
                          {emoji || <span className="text-sm">Icon</span>}
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
                          value={emoji}
                          onChange={(e) => setEmoji(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddBudget}>
                        {isAdding ? "Loading..." : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            {budgets?.map((data) => {
              const totalSpent =
                data?.expenses?.reduce(
                  (total, expense) => total + expense.price,
                  0
                ) || 0;
              const remainingAmount = data ? data.amount - totalSpent : 0;
              const progressValue = data ? (totalSpent / data.amount) * 100 : 0;
              return (
                <Link to={`/${data._id}`} key={data._id}>
                  <Card>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgets;
