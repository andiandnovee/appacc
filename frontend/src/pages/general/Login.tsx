import { FC, ReactNode, ReactElement, useState } from 'react';
import { useAuth } from "../../hooks/useAuth";

import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LayoutDashboard } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import { useToast } from "../../components/ui/Toast";
import styles from "./Login.module.css";

interface LoginProps {
  // Props here
}


/* ── Google Icon SVG ───────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

/* ════════════════════════════════════════════════════════════
   Login Page
   ════════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Input handler ───────────────────────────────────────
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Hapus error field saat user mulai ketik
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
  };

  // ── Validasi client-side ────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Format email tidak valid";
    if (!form.password) errs.password = "Password wajib diisi";
    else if (form.password.length < 6)
      errs.password = "Password minimal 6 karakter";
    return errs;
  };

  // ── Submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          remember: form.remember,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Laravel validation error (422) atau unauthorized (401)
        setApiError(
          data.message ?? "Login gagal, periksa kembali kredensial Anda.",
        );
        return;
      }

      // Simpan JWT token
      // Kalau remember: localStorage, kalau tidak: sessionStorage
      // Simpan token + set user via context
      login(data.token, data.data, form.remember);

      addToast({
        variant: "success",
        title: "Login berhasil",
        description: `Selamat datang kembali, ${data.data?.name}!`,
      });
      navigate("/");
      // navigate("/dashboard");
    } catch {
      setApiError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ────────────────────────────────────────
  // ── Google login ────────────────────────────────────────
  const handleGoogle = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google/redirect`,
        { headers: { Accept: "application/json" } },
      );
      const data = await res.json();

      if (data?.data?.redirect_url) {
        window.location.href = data.data.redirect_url;
      } else {
        setApiError("Gagal mendapatkan URL Google. Coba lagi.");
      }
    } catch {
      setApiError("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Card variant="outlined">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <LayoutDashboard size={24} color="#ffffff" />
            </div>
            <h1 className={styles.title}>Masuk ke APPACC</h1>
            <p className={styles.subtitle}>
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.body}>
              {/* API Error */}
              {apiError && (
                <Alert
                  variant="danger"
                  description={apiError}
                  dismissible
                  onDismiss={() => setApiError("")}
                />
              )}

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="nama@domain.com"
                error={errors.email}
                required
                autoComplete="email"
                autoFocus
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Masukkan password"
                error={errors.password}
                required
                autoComplete="current-password"
              />

              {/* Remember me + Forgot password */}
              <div className={styles.row}>
                <label className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    className={styles.rememberCheckbox}
                    checked={form.remember}
                    onChange={handleChange("remember")}
                  />
                  <span className={styles.rememberLabel}>Ingat saya</span>
                </label>

                <Link to="/forgot-password" className={styles.forgotLink}>
                  Lupa password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Masuk
              </Button>

              {/* Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>atau masuk dengan</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Google */}
              <button
                type="button"
                className={styles.socialBtn}
                onClick={handleGoogle}
              >
                <GoogleIcon />
                Lanjutkan dengan Google
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Belum punya akun?{" "}
              <Link to="/register" className={styles.footerLink}>
                Daftar sekarang
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
