import { createBrowserRouter } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import Home from "../pages/Home"
import About from "../pages/About"

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      }
    ]
  }
])

export default router