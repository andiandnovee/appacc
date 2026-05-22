// components/ProtectedRoute.jsx
import { FC, ReactNode, ReactElement } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  // Props here
}


export default function ProtectedRoute() {
  const auth = useAuth();

  if (!auth || auth.loading) return <div>Loading...</div>;
  if (!auth.user) return <Navigate to="/login" replace />;

  return <Outlet />;
}