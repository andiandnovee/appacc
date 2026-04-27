import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// ─── Environment Detection ────────────────────────────────────────────────────
// IS_PROD = true  → production : token di HttpOnly Cookie (browser)
// IS_PROD = false → local/dev  : token di localStorage   (mobile-style)
const IS_PROD = import.meta.env.PROD;
const CLIENT_TYPE = IS_PROD ? "browser" : "mobile";

// ─── Storage Helpers (hanya dipakai di local/dev) ────────────────────────────
const TOKEN_KEY = "appacc_token";

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  if (sessionStorage.getItem(TOKEN_KEY)) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Client-Type": CLIENT_TYPE,
    // production → backend return token di cookie
    // local      → backend return token di body (mobile mode)
  },
  withCredentials: IS_PROD,
  // production : true  → browser kirim HttpOnly cookie otomatis
  // local      : false → tidak butuh cookie, pakai localStorage
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!IS_PROD) {
    // Local: inject token dari localStorage ke Authorization header
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // Production: browser otomatis kirim HttpOnly cookie, tidak perlu inject
  return config;
});

// ─── Refresh Queue ────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const forceLogout = (): void => {
  if (!IS_PROD) {
    clearToken(); // local: bersihkan localStorage
  }
  // production: cookie akan dihapus oleh backend saat /auth/logout
  window.location.href = "/login";
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Bukan 401, atau sudah pernah retry → lempar error langsung
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Refresh endpoint sendiri yang 401 → token sudah tidak bisa di-refresh → logout
    if (originalRequest.url?.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Ada request lain yang sedang refresh → masuk antrian
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (!IS_PROD && token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post<{ token?: string }>("/auth/refresh");

      if (!IS_PROD) {
        // ── Local/Dev ────────────────────────────────────────────────────────
        // Backend return token di body (X-Client-Type: mobile)
        const newToken = data.token;
        if (!newToken) throw new Error("Token tidak ada di response refresh");

        setToken(newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

      } else {
        // ── Production ───────────────────────────────────────────────────────
        // Backend sudah set HttpOnly cookie baru via Set-Cookie header
        // Frontend tidak perlu lakukan apa-apa, browser otomatis pakai cookie baru
        processQueue(null, null);
      }

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;