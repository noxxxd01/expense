import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex flex-row">
      <div className="w-64 hidden xl:inline-block transition ease-in-out">
        <Sidebar />
      </div>
      <div className="w-full">
        <Navbar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
