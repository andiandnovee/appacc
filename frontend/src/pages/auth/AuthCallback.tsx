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
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Ambil data user dengan token yang baru diterima
    api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        login(token, res.data.data, false); // default: sessionStorage
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
