import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import {
  LayoutDashboard,
  PiggyBank,
  ScrollText,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <div className="h-full fixed w-[13.5rem] border-r-[1px]">
      <div className="py-2.5 px-4 pl-7 flex items-center gap-2">
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
      <Separator className="hidden lg:block" />
      <ul className="mt-5 px-2 flex flex-col text-sm font-medium leading-none w-full">
        <div className="flex flex-col gap-y-2 w-full">
          <Link
            to="/dashboard"
            className={`w-full flex items-center gap-3 pl-4 cursor-pointer rounded py-3 hover:bg-gray-100 
              ${activeTab === "dashboard" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            <span className="w-full">Dashboard</span>
          </Link>
          <Link
            to="/budget"
            className={`flex items-center gap-3 pl-4 cursor-pointer rounded py-3 hover:bg-gray-100 
              ${activeTab === "budget" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("budget")}
          >
            <PiggyBank size={18} />
            <span className="w-full">Budgets</span>
          </Link>
          <Link
            to="/expenses"
            className={`flex items-center gap-3 pl-4 cursor-pointer rounded py-3 hover:bg-gray-100 
              ${activeTab === "expenses" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            <ScrollText size={18} />
            <span className="w-full">Expenses</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-3 pl-4 cursor-pointer rounded py-3 hover:bg-gray-100 
              ${activeTab === "profile" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            <span to="settings" className="w-full">
              Profile
            </span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-3 pl-4 cursor-pointer rounded py-3 hover:bg-gray-100 
              ${activeTab === "settings" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            <span to="settings" className="w-full">
              Settings
            </span>
          </Link>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
