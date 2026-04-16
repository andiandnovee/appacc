import {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
  ReactNode,
} from "react";
import api from "../api/axios";

interface User {
  id: string | number;
  name: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User, remember?: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Boot: cek token di storage ─────────────────────────────
  useEffect(() => {
    const token =
      localStorage.getItem("appacc_token") ??
      sessionStorage.getItem("appacc_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("appacc_token");
        sessionStorage.removeItem("appacc_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login: simpan token + set user ─────────────────────────
  const login = (token: string, userData: User, remember = false): void => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("appacc_token", token);
    setUser(userData);
  };

  // ── Logout: hapus token + clear user ───────────────────────
  const logout = async (): Promise<void> => {
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
};

export const useAuth = (): AuthContextType | null => useContext(AuthContext);
