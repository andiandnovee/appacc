import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./layouts/Dashboardlayout";

import Home from "./pages/general/Home";
import Users from "./pages/general/Users";
import Settings from "./pages/general/Settings";

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
  );
}
