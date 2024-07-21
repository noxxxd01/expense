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
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

//
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useSignupMutation } from "@/redux/api/users";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();

  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Password does not match.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      try {
        const res = await signup({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));

        const currentTime = new Date().toLocaleString();
        toast({
          title: "Account created successfully",
          description: `Account created at ${currentTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to create account.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex justify-center items-center h-[100vh] px-6 xl:px-0 transition-all ease-in-out"
    >
      <Link to="/">
        <Button className="absolute left-4 top-4" variant="outline">
          <ArrowLeft size={20} />
        </Button>
      </Link>
      <Card className="w-full md:w-[30rem] lg:w-[30rem] mx-auto p-5">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email and password below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-5 text-center">
          <Button type="submit" size="sm" className="w-full">
            {isLoading ? "Loading..." : "Create an account"}
          </Button>
          <CardDescription>
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy.
          </CardDescription>
          <div>
            <CardDescription>
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Sign in here
              </Link>
            </CardDescription>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SignUp;
