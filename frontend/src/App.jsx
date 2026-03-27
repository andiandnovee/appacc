import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import DashboardLayout from "./layouts/Dashboardlayout";
import AdminLayout from "./layouts/Adminlayout";

import Login from "./pages/general/Login";
import AuthCallback from "./pages/auth/AuthCallback";
import Home from "./pages/general/Home";
import Users from "./pages/general/Users";
import Settings from "./pages/general/Settings";
import UserManagement from "./pages/admin/UserManagement";
import VendorManagement from "./pages/invoice/VendorManagement";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ── Public ──────────────────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ── Protected ───────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/invoice/vendors" element={<VendorManagement />} />
              </Route>
            </Route>

            {/* ── Fallback ────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
