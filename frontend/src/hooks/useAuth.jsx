import { useState, useEffect, createContext, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Boot: cek token di storage ─────────────────────────────
  useEffect(() => {
    const token =
      localStorage.getItem("appacc_token") ?? sessionStorage.getItem("appacc_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("appacc_token");
        sessionStorage.removeItem("appacc_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login: simpan token + set user ─────────────────────────
  const login = (token, userData, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("appacc_token", token);
    setUser(userData);
  };

  // ── Logout: hapus token + clear user ───────────────────────
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // tetap logout meski request gagal
    } finally {
      localStorage.removeItem("appacc_token");
      sessionStorage.removeItem("appacc_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);