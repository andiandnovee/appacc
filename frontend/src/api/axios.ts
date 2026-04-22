import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: inject access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("appacc_token") ?? sessionStorage.getItem("appacc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Queue untuk multiple request
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika bukan 401 atau sudah retry, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Cegah jika endpoint refresh itu sendiri yang gagal
    if (originalRequest.url === '/auth/refresh') {
      // Refresh token expired, logout
      localStorage.removeItem("appacc_token");
      localStorage.removeItem("apprefresh_token");
      sessionStorage.removeItem("appacc_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Jika sedang refresh, masukkan request ke antrian
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    // Ambil refresh token dari storage (misal pakai localStorage)
    const refreshToken = localStorage.getItem("apprefresh_token") ?? sessionStorage.getItem("apprefresh_token");

    if (!refreshToken) {
      // Tidak ada refresh token, logout
      localStorage.removeItem("appacc_token");
      sessionStorage.removeItem("appacc_token");
      window.location.href = "/login";
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // Panggil endpoint refresh dengan mengirim refresh token di body
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken }, // kirim refresh token di body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = response.data.accessToken; // sesuaikan dengan response backend
      // Jika backend juga mengirim refresh token baru (rotation), simpan juga
      const newRefreshToken = response.data.refreshToken || refreshToken;

      // Simpan token baru
      if (localStorage.getItem("appacc_token")) {
        localStorage.setItem("appacc_token", newAccessToken);
        if (newRefreshToken !== refreshToken) localStorage.setItem("apprefresh_token", newRefreshToken);
      } else {
        sessionStorage.setItem("appacc_token", newAccessToken);
        if (newRefreshToken !== refreshToken) sessionStorage.setItem("apprefresh_token", newRefreshToken);
      }

      // Update header default
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // Proses semua request yang tertunda
      processQueue(null, newAccessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh gagal, hapus token dan logout
      processQueue(refreshError, null);
      localStorage.removeItem("appacc_token");
      localStorage.removeItem("apprefresh_token");
      sessionStorage.removeItem("appacc_token");
      sessionStorage.removeItem("apprefresh_token");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;