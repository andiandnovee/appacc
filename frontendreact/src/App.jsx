import { BrowserRouter, Routes, Route } from "react-router-dom"

import DashboardLayout from "./layouts/DashboardLayout"

import Home from "./pages/Home"
import Users from "./pages/Users"
import Settings from "./pages/Settings"

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<DashboardLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/users" element={<Users />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}