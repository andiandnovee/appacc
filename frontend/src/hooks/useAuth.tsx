import {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
  ReactNode,
} from "react";
import api, { getToken, setToken, clearToken } from "../api/axios";

// ─── Types ───────────────────────────────────────────────────────
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

// ─── Context ─────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Boot: cek token di storage, validasi ke /auth/me
  // Boot check — sudah benar, tapi pastikan catch tidak clearToken di production
  useEffect(() => {
    const IS_PROD = import.meta.env.PROD;
    const token = getToken();

    if (!IS_PROD && !token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        if (!IS_PROD) clearToken(); // local: hapus token invalid
        // production: tidak lakukan apa-apa, user memang belum login
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  // Login: simpan token + set user
  const login = (
    token: string | null,
    userData: User,
    remember = true,
  ): void => {
    const IS_PROD = import.meta.env.PROD;

    if (!IS_PROD && token) {
      // Local/dev: simpan token ke storage
      if (remember) {
        localStorage.setItem("appacc_token", token);
        sessionStorage.removeItem("appacc_token");
      } else {
        sessionStorage.setItem("appacc_token", token);
        localStorage.removeItem("appacc_token");
      }
    }
    // Production: tidak simpan apa-apa, token sudah di HttpOnly cookie

    setUser(userData);
  };

  // Logout: invalidate di backend + hapus token lokal
  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // tetap logout meski request gagal
      console.warn(
        "hooks :Logout request failed, but clearing local auth state anyway",
      );
    } finally {
      clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType | null => useContext(AuthContext);
