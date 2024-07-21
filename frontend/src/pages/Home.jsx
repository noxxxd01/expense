import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

import img from "../../public/dashboard.png";

export const Home = () => {
  return (
    <div>
      <Card className="border-none shadow-none container mx-auto px-7 sm:px-10 lg:px-[10rem] transistion ease-in-out">
        <CardContent className="p-0 flex items-center justify-between py-1">
          <div className="py-2.5 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 74 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.3228 21.3382L20.2313 16.7772L15.8169 9.1354H57.3331L36.5817 45.0903L32.1673 37.4352L24.2589 42.0096L36.5817 63.348L73.15 0H0L12.3228 21.3382Z"
                fill="#414042"
              />
            </svg>
            <h1 className="font-bold text-lg">Expense</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/signin">
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Separator />
      <Card className="border-none shadow-none container mx-auto sm:px-10 lg:px-[10rem] transistion ease-in-out py-[5rem]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            Master Your Finances: Track Every Expense and Budget with Ease!
          </CardTitle>
          <CardDescription className="text-md">
            Take control of your financial future with our intuitive expense
            tracker and budgeting tool.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="mt-10">
            <img src={img} alt="" className="shadow-xl rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
