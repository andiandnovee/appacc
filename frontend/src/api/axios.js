import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: inject token ─────────────────────────
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response interceptor: handle 401 → refresh atau logout ────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // Kalau 401 dan belum pernah retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") ?? sessionStorage.getItem("token")
              }`,
            },
          }
        );

        const newToken = res.data.token;

        // Simpan ke storage yang sama
        if (localStorage.getItem("token")) {
          localStorage.setItem("token", newToken);
        } else {
          sessionStorage.setItem("token", newToken);
        }

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry request asal

      } catch {
        // Refresh gagal → paksa logout
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
