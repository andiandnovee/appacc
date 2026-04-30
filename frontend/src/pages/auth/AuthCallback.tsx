import { FC, ReactNode, ReactElement, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

interface AuthCallbackProps {
  // Props here
}


export default function AuthCallback() {
  const { login }          = useAuth();
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();

  useEffect(() => {
  const error = searchParams.get("error");
  if (error) {
    navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
    return;
  }

  const tokenFromUrl = searchParams.get("token");

  if (tokenFromUrl) {
    // Simpan ke localStorage supaya persist saat browser ditutup
    localStorage.setItem("appacc_token", tokenFromUrl);
    window.history.replaceState({}, '', '/auth/callback');
  }

  api.get("/auth/me")
    .then((res) => {
      login(tokenFromUrl ?? null, res.data.data, true); // true = localStorage
      navigate("/", { replace: true });
    })
    .catch(() => {
      navigate("/login?error=Token+tidak+valid", { replace: true });
    });
}, []);

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <p>Memproses login...</p>
    </div>
  );
}
