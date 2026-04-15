import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/general/Home";
import About from "../pages/general/About";
import UserManagement from "../pages/admin/UserManagement";
import VendorManagement from "../pages/invoice/VendorManagement";
import Receipt from "../pages/invoice/Receipt"; 

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/admin/users", element: <UserManagement /> },
      { path: "/invoice/vendors", element: <VendorManagement /> },
      { path: "/invoice/receipts", element: <Receipt /> },

      // ✅ format object
    ],
  },
]);

export default router;
