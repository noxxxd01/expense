import { LogOut, Menu, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Sidebar from "./Sidebar";

//
import { useDispatch, useSelector } from "react-redux";
import { useSignoutMutation } from "@/redux/api/users";
import { useNavigate } from "react-router";
import { logout } from "@/redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [signout, { isLoading }] = useSignoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      await signout().unwrap();
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to signout.",
        action: (
          <ToastAction altText="Try again">
            <Link to="/dashboard">Try Again</Link>
          </ToastAction>
        ),
      });
    }
  };

  return (
    <div className="py-2 border-b-[1px] px-7">
      <div className="flex justify-between lg:justify-end items-center">
        <div className="cursor-pointer lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu size={19} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[16.5rem]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex flex-col font-medium">
              {userInfo.name}
              <span className="text-xs text-gray-500">{userInfo.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logoutHandler}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? "Loading..." : "Sign Out"}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
