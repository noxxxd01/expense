import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

// Public
import { Home } from "./pages/Home";

// Auth pages
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";

// User pages
import UserRoute from "./pages/private/UserRoute";
import DashboardLayout from "./pages/private/DashboardLayout";
import Budgets from "./pages/private/Budgets";
import Expenses from "./pages/private/Expenses";
import Overview from "./pages/private/Overview";
import Settings from "./pages/private/Settings";
import BudgetDetails from "./pages/private/BudgetDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="" element={<UserRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index path="/dashboard" element={<Overview />} />
            <Route path="/budget" element={<Budgets />} />
            <Route path="/:id" element={<BudgetDetails />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
