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
  const IS_PROD = import.meta.env.PROD;

  const error = searchParams.get("error");
  if (error) {
    navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
    return;
  }

  const code         = searchParams.get("code");    // production OAuth
  const tokenFromUrl = searchParams.get("token");   // local/dev

  // Local/dev: token langsung di URL
  if (!IS_PROD && tokenFromUrl) {
    localStorage.setItem("appacc_token", tokenFromUrl);
    window.history.replaceState({}, "", "/auth/callback");

    api.get("/auth/me").then((res) => {
      login(tokenFromUrl, res.data.data, true);
      navigate("/", { replace: true });
    }).catch(() => {
      navigate("/login?error=Token+tidak+valid", { replace: true });
    });
    return;
  }

  // Production: tukar code → cookie di-set backend
  if (IS_PROD && code) {
    api.post("/auth/exchange", { code })
      .then((res) => {
        // Cookie sudah di-set oleh respondWithToken
        login(null, res.data.data, true);
        navigate("/", { replace: true });
      })
      .catch(() => {
        navigate("/login?error=Token+tidak+valid", { replace: true });
      });
    return;
  }

  // Tidak ada code maupun token
  navigate("/login?error=Parameter+tidak+valid", { replace: true });
}, []);

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <p>Memproses login...</p>
    </div>
  );
}
