import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// ─── Storage helpers ─────────────────────────────────────────────
const TOKEN_KEY = "appacc_token";

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  // Simpan ke storage yang sama dengan yang sudah ada
  if (sessionStorage.getItem(TOKEN_KEY)) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.setItem(TOKEN_KEY, token); // default localStorage
  }
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ─── Axios instance ──────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor ─────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
   console.log(`[REQ] ${config.method?.toUpperCase()} ${config.url} | token: ${token ? token.slice(-10) : 'NULL'}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Refresh queue ───────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const forceLogout = (): void => {
  clearToken();
  window.location.href = "/login";
};

// ─── Response interceptor ────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 👇 CEK A
    console.log(`[RES ERROR] ${originalRequest?.url} | status: ${error.response?.status} | _retry: ${originalRequest?._retry}`);

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Refresh endpoint sendiri yang 401 → sudah tidak bisa refresh → logout
    if (originalRequest.url?.includes("/auth/refresh")) {
       console.log('[REFRESH FAILED] Token sudah tidak bisa di-refresh → logout');
      
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;
 console.log('[REFRESH] Memulai refresh token...');
    try {
      // Token lama otomatis dikirim via request interceptor di atas
      const { data } = await api.post<{ token: string }>("/auth/refresh");

      const newToken = data.token; // ✅ sesuai response backend
// 👇 CEK C
      console.log('[REFRESH] Response:', data);
      console.log('[REFRESH] newToken:', newToken ? newToken.slice(-10) : 'NULL/UNDEFINED');



      if (!newToken) throw new Error("Token tidak ada di response refresh");

      setToken(newToken);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

       console.log('[REFRESH] Sukses → retry original request');
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