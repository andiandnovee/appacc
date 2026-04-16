// components/ProtectedRoute.jsx
import { FC, ReactNode, ReactElement } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  // Props here
}


export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // cek token dulu
  if (!user) return <Navigate to="/login" replace />; // belum login → redirect

  return <Outlet />; // sudah login → lanjut ke halaman
}
