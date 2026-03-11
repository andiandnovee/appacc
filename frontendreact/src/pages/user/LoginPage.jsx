import { useState, useEffect } from "react";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";
const API_BASE = "http://localhost:8000/api";

// ─── Google Icon ─────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// ─── Facebook Icon ────────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ─── Eye Icons ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(null); // null | 'google' | 'facebook' | 'form'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── Form Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading("form");
    setError("");
    try {
      const endpoint = mode === "login" ? "/login" : "/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSuccess(
        mode === "login"
          ? "Welcome back! Redirecting…"
          : "Account created! Redirecting…",
      );
      // store token: localStorage.setItem('token', data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  // ── Google OAuth ────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading("google");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/google/redirect`);
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Google login failed. Please try again.");
      setLoading(null);
    }
  };

  // ── Facebook OAuth ──────────────────────────────────────────────────────────
  const handleFacebook = async () => {
    setLoading("facebook");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/facebook/redirect`);
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Facebook login failed. Please try again.");
      setLoading(null);
    }
  };

  const isLoading = loading !== null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Sora', sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scene {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #080810;
        }

        /* ── Animated background ── */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .bg-orb-1 { width: 500px; height: 500px; background: #5b4af7; top: -10%; left: -10%; animation-delay: 0s; }
        .bg-orb-2 { width: 400px; height: 400px; background: #0ea5e9; bottom: -5%; right: -5%; animation-delay: -4s; }
        .bg-orb-3 { width: 300px; height: 300px; background: #a855f7; top: 40%; left: 60%; animation-delay: -8s; }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, -30px) scale(1.05); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Card ── */
        .card {
          position: relative;
          width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? "0" : "24px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        /* ── Logo / Brand ── */
        .brand {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 32px;
        }
        .brand-dot {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #5b4af7, #a855f7);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 18px; font-weight: 700; color: #fff;
          box-shadow: 0 0 20px rgba(91,74,247,0.5);
        }
        .brand-name {
          font-family: 'Space Mono', monospace;
          font-size: 15px; font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.04em;
        }

        /* ── Mode Toggle ── */
        .mode-toggle {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .mode-btn {
          flex: 1; padding: 9px;
          border: none; background: transparent; cursor: pointer;
          border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.4);
          transition: all 0.25s ease;
        }
        .mode-btn.active {
          background: rgba(91,74,247,0.8);
          color: #fff;
          box-shadow: 0 2px 12px rgba(91,74,247,0.4);
        }

        /* ── OAuth Buttons ── */
        .oauth-row { display: flex; gap: 10px; margin-bottom: 22px; }
        .oauth-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .oauth-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }
        .oauth-btn:active:not(:disabled) { transform: translateY(0); }
        .oauth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .oauth-btn.loading-state { opacity: 0.7; }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 22px;
        }
        .divider-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .divider-text {
          font-size: 11px; color: rgba(255,255,255,0.3);
          font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Fields ── */
        .field { margin-bottom: 14px; }
        .field label {
          display: block;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .field-wrap { position: relative; }
        .field input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 11px;
          color: rgba(255,255,255,0.9);
          font-family: 'Sora', sans-serif; font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field input::placeholder { color: rgba(255,255,255,0.2); }
        .field input:focus {
          border-color: rgba(91,74,247,0.6);
          background: rgba(91,74,247,0.06);
        }
        .field input.has-toggle { padding-right: 44px; }
        .toggle-pw {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 4px;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(255,255,255,0.6); }

        /* ── Forgot ── */
        .forgot {
          display: block; text-align: right;
          font-size: 12px; color: rgba(91,74,247,0.9);
          text-decoration: none; margin-bottom: 20px;
          transition: color 0.2s;
        }
        .forgot:hover { color: #a855f7; }

        /* ── Submit ── */
        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #5b4af7, #7c3aed);
          border: none; border-radius: 12px;
          color: #fff; font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; letter-spacing: 0.02em;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(91,74,247,0.35);
          position: relative; overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(91,74,247,0.5);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Alerts ── */
        .alert {
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .alert-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
        }
        .alert-success {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #86efac;
        }

        /* ── Footer ── */
        .footer {
          text-align: center; margin-top: 22px;
          font-size: 12px; color: rgba(255,255,255,0.3);
        }
        .footer a {
          color: rgba(91,74,247,0.9); text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .footer a:hover { color: #a855f7; }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .card { width: 92vw; padding: 32px 24px; }
          .oauth-row { flex-direction: column; }
        }
      `}</style>

      <div className="scene">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="grid-overlay" />

        <div className="card">
          {/* Brand */}
          <div className="brand">
            <div className="brand-dot">A</div>
            <div className="brand-name">AUTHKIT</div>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Sign In
            </button>
            <button
              className={`mode-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          {/* OAuth */}
          <div className="oauth-row">
            <button
              className={`oauth-btn ${loading === "google" ? "loading-state" : ""}`}
              onClick={handleGoogle}
              disabled={isLoading}
            >
              {loading === "google" ? (
                <span className="spinner" />
              ) : (
                <GoogleIcon />
              )}
              Google
            </button>
            <button
              className={`oauth-btn ${loading === "facebook" ? "loading-state" : ""}`}
              onClick={handleFacebook}
              disabled={isLoading}
            >
              {loading === "facebook" ? (
                <span className="spinner" />
              ) : (
                <FacebookIcon />
              )}
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with email</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <label>Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleInput}
                  required
                />
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleInput}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="has-toggle"
                  value={form.password}
                  onChange={handleInput}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {mode === "login" && (
              <a href="/forgot-password" className="forgot">
                Forgot password?
              </a>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {loading === "form" && <span className="spinner" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="footer">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("register");
                  }}
                >
                  Sign up free
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("login");
                  }}
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
