import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/general/Home";
import About from "../pages/general/About";

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/admin/users", element: <UserManagement /> }, // ✅ format object
    ],
  },
]);

export default router;
