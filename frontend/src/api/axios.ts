import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// ─── Environment Detection ────────────────────────────────────────────────────
const IS_PROD = import.meta.env.PROD;
const CLIENT_TYPE = IS_PROD ? "browser" : "mobile";

// ─── Storage Helpers ──────────────────────────────────────────────────────────
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
  },
  withCredentials: IS_PROD,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!IS_PROD) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
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
  if (!IS_PROD) clearToken();
  window.location.href = "/login";
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Bukan 401 → lempar langsung
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ── /auth/refresh gagal → paksa logout, jangan loop ──────────────────────
    if (originalRequest.url?.includes("/auth/refresh")) {
      processQueue(error, null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    // ── /auth/login & /auth/exchange → jangan retry, biarkan komponen handle ─
    const skipRetryUrls = ["/auth/login", "/auth/exchange"];
    if (skipRetryUrls.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // ── Sudah pernah retry → jangan loop ─────────────────────────────────────
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ── Ada request lain sedang refresh → antri ───────────────────────────────
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
        const newToken = data.token;
        if (!newToken) throw new Error("Token tidak ada di response refresh");
        setToken(newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      } else {
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