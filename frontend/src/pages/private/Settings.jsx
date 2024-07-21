import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

//
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation, useDeleteMutation } from "@/redux/api/users";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { logout } from "@/redux/features/auth/authSlice";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isOpen, setIsOpen] = useState(false);

  //
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //
  const { userInfo } = useSelector((state) => state.auth);
  const [profileUpdate, { isLoading }] = useProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.name, userInfo.email]);

  const handleUpdate = async (e) => {
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
        const res = await profileUpdate({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        console.log(res);

        dispatch(setCredentials({ ...res }));

        const currentTime = new Date().toLocaleString();
        toast({
          title: "Account updated successfully",
          description: `Account updated at ${currentTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update account.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount({ _id: userInfo._id }).unwrap();
      dispatch(logout());

      const currentTime = new Date().toLocaleString();
      toast({
        title: "Account deleted successfully",
        description: `Account deleted at ${currentTime}`,
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete account.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const toggleTabs = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-10">
      <div className="mb-7">
        <h2 className="scroll-m-20 mb-1 text-2xl font-bold tracking-tight first:mt-0">
          Settings
        </h2>
        <p className="text-md text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator />
      <div className="md:flex md:flex-row grid grid-cols-1 gap-6 my-8">
        <div className="w-60 flex-row md:flex-col flex gap-y-2">
          <Button
            variant="link"
            onClick={() => toggleTabs("profile")}
            className={`flex justify-start focus:bg-gray-100 ${
              activeTab === "profile" ? "text-blue-500 focus:bg-gray-100" : ""
            }`}
          >
            Profile
          </Button>
          <Button
            variant="link"
            onClick={() => toggleTabs("account")}
            className={`flex justify-start focus:bg-gray-100 ${
              activeTab === "account" ? "text-blue-500 focus:bg-gray-100" : ""
            }`}
          >
            Account
          </Button>
        </div>
        {activeTab === "profile" && (
          <div className="md:w-[40rem] w-full">
            <div className="mb-6">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Profile
              </h4>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator />
            <form className="mt-10" onSubmit={handleUpdate}>
              <div className="flex flex-col gap-y-8">
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John doe"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
                <div className="flex flex-row items-center gap-10">
                  <div className="flex flex-col space-y-3">
                    <Label htmlFor="name">Avatar</Label>
                    <Input id="name" type="file" placeholder="John doe" />
                  </div>
                  <div>
                    <Avatar className="w-10 h-10 cursor-pointer">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Button type="submit">
                  {isLoading ? "Loading..." : "Update profile"}
                </Button>
              </div>
            </form>
          </div>
        )}
        {activeTab === "account" && (
          <div className="md:w-[40rem] w-full">
            <div className="mb-6">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Account
              </h4>
              <p className="text-sm text-muted-foreground">
                Delete your account
              </p>
            </div>
            <Separator />
            <div className="mt-10">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" onClick={() => setIsOpen(true)}>
                    Delete account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure to delete this account?
                    </DialogTitle>
                    <DialogDescription>
                      Deleting the account can be a significant and irreversible
                      action.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-5 flex flex-col gap-y-3">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
