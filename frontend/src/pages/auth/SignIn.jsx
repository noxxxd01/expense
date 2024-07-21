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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

//
import { useDispatch, useSelector } from "react-redux";
import { useSigninMutation } from "@/redux/api/users";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useState, useEffect } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signin, { isLoading }] = useSigninMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await signin({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to sign in your account.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };
  return (
    <form
      onSubmit={handleSignin}
      className="flex justify-center items-center h-[100vh] px-6 xl:px-0 transition-all ease-in-out"
    >
      <Card className="w-full md:w-[30rem] lg:w-[30rem] mx-auto p-5">
        <CardHeader className="text-center">
          <CardTitle>Sign in your account</CardTitle>
          <CardDescription>
            Enter your email and password below to sign in your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@example.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-5 text-center">
          <Button type="submit" size="sm" className="w-full">
            {isLoading ? "Loading..." : "Sign in"}
          </Button>
          <div>
            <CardDescription>
              Don't have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up here
              </Link>
            </CardDescription>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SignIn;
