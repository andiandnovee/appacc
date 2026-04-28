import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/Dashboardlayout";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import Login from "../pages/general/Login";
import Home from "../pages/general/Home";
import About from "../pages/general/About";
import UserManagement from "../pages/admin/UserManagement";
import VendorManagement from "../pages/invoice/VendorManagement";
import Receipt from "../pages/invoice/Receipt";

const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <Login /> },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/admin/users", element: <UserManagement /> },
          { path: "/invoice/vendors", element: <VendorManagement /> },
          { path: "/invoice/receipts", element: <Receipt /> },
        ],
      },
    ],
  },
]);

export default router;