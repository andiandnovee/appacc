import { FC, ReactNode, ReactElement, useId, useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  value?: any;
  onChange?: any;
  type?: any;
  label?: any;
  placeholder?: any;
  hint?: any;
  error?: any;
  size?: any;
  disabled?: any;
  readOnly?: any;
  required?: any;
  rows?: any;
  iconLeft?: any;
  iconRight?: any;
  rest?: any;
}

/* ── Icon preset per type ──────────────────────────────────── */
// Icon SVG inline — tidak perlu install library tambahan.
// Kalau sudah pakai lucide-react, bisa diganti di sini.

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4h12v8.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V4z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M2 4l6 5 6-5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconUrl = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7.5 3.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconTel = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.5 2.5h-2a1 1 0 00-1 1C2.5 9.956 7.044 14.5 13.5 14.5a1 1 0 001-1v-2a1 1 0 00-1-1l-2.5-.5a1 1 0 00-.9.3l-1 1a8.07 8.07 0 01-3.4-3.4l1-1a1 1 0 00.3-.9L6.5 3.5a1 1 0 00-1-1z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M10.5 10.5l3 3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.9M4.5 4.6C2.9 5.7 1.5 8 1.5 8s2.5 5 6.5 5c1.3 0 2.5-.4 3.5-1M6 3.2C6.6 3.1 7.3 3 8 3c4 0 6.5 5 6.5 5s-.6 1.2-1.7 2.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconClear = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 2l10 10M12 2L2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Preset config per type ────────────────────────────────── */
const TYPE_PRESETS = {
  email: { iconLeft: <IconEmail /> },
  url: { iconLeft: <IconUrl /> },
  tel: { iconLeft: <IconTel /> },
  search: { iconLeft: <IconSearch /> },
  // password & number dihandle di dalam komponen
};

/* ════════════════════════════════════════════════════════════
   Input Component
   ════════════════════════════════════════════════════════════ */

/**
 * Props:
 * - value, onChange    → controlled (wajib)
 * - type               → 'text' | 'email' | 'password' | 'number' |
 *                        'date' | 'time' | 'datetime-local' |
 *                        'tel' | 'url' | 'search' | 'textarea'
 * - label              → teks label
 * - placeholder        → placeholder
 * - hint               → pesan bantuan
 * - error              → pesan error
 * - size               → 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled           → boolean
 * - readOnly           → boolean
 * - required           → boolean
 * - rows               → jumlah baris textarea (default: 4)
 * - iconLeft           → override icon kiri (React node)
 * - iconRight          → override icon kanan (React node)
 * - ...rest            → diteruskan ke <input> / <textarea>
 */
const Input: FC<InputProps> = ({
  value,
  onChange,
  type = "text",
  label,
  placeholder,
  hint,
  error,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  rows = 4,
  iconLeft,
  iconRight,
  rest,
}) => {
  const id = useId();

  // ── Password: state untuk toggle show/hide ──────────────
  const [showPassword, setShowPassword] = useState(false);

  // ── Search: state untuk tombol clear ───────────────────
  // clear hanya muncul kalau value tidak kosong
  const showClear = type === "search" && value && value.length > 0;

  // ── Tentukan type aktual (password bisa jadi 'text') ───
  const resolvedType = type === "password" && showPassword ? "text" : type;

  // ── Preset icon kiri otomatis per type ─────────────────

  const presetIconLeft = TYPE_PRESETS[type]?.iconLeft ?? null;

  // prop iconLeft dari luar override preset
  const resolvedIconLeft = iconLeft ?? presetIconLeft;
  // iconRight dari luar override; password & search punya icon kanan sendiri
  const hasRightControl = type === "password" || showClear;
  const resolvedIconRight = !hasRightControl ? iconRight : null;

  // ── Class input ─────────────────────────────────────────
  const inputClass = [
    type === "textarea" ? styles.textarea : styles.input,
    styles[size],
    error ? styles.error : "",
    resolvedIconLeft ? styles.hasIconLeft : "",
    // padding kanan: icon kanan / toggle / clear
    resolvedIconRight || hasRightControl ? styles.hasIconRight : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    id,
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    className: inputClass,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
    ...rest,
  };

  return (
    <div className={styles.wrapper}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${required ? styles.labelRequired : ""}`}
        >
          {label}
        </label>
      )}

      {/* Input container */}
      <div className={styles.container}>
        {/* Icon kiri */}
        {resolvedIconLeft && (
          <span className={styles.iconLeft} aria-hidden="true">
            {resolvedIconLeft}
          </span>
        )}

        {/* Textarea */}
        {type === "textarea" ? (
          <textarea rows={rows} {...sharedProps} />
        ) : (
          <input type={resolvedType} {...sharedProps} />
        )}

        {/* Icon kanan biasa */}
        {resolvedIconRight && !hasRightControl && (
          <span className={styles.iconRight} aria-hidden="true">
            {resolvedIconRight}
          </span>
        )}

        {/* Password: toggle show/hide */}
        {type === "password" && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            tabIndex={-1}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        )}

        {/* Search: tombol clear */}
        {showClear && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onChange({ target: { value: "" } })}
            aria-label="Hapus pencarian"
            tabIndex={-1}
          >
            <IconClear />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          id={`${id}-error`}
          className={`${styles.message} ${styles.messageError}`}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p
          id={`${id}-hint`}
          className={`${styles.message} ${styles.messageHint}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
