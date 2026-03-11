import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Authprovider } from "./hooks/useAuth"
import ProtectedRoute from "./components/ProtectedRoute"



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