import {
  FC,
  ReactNode,
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

// ── Tipe untuk satu toast ───────────────────────────────────
export type ToastVariant = "success" | "warning" | "danger" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
}

// ── Tipe untuk context ──────────────────────────────────────
interface ToastContextValue {
  addToast: (toast: Omit<Toast, "id">) => void;
}

// ── Icon mapping ────────────────────────────────────────────
const VARIANT_CONFIG: Record<ToastVariant, { icon: React.ElementType }> = {
  success: { icon: CheckCircle },
  warning: { icon: AlertTriangle },
  danger: { icon: XCircle },
  info: { icon: Info },
};

// ════════════════════════════════════════════════════════════
// Context (default value null, tapi akan selalu diisi Provider)
// ════════════════════════════════════════════════════════════
const ToastContext = createContext<ToastContextValue | null>(null);

// ════════════════════════════════════════════════════════════
// ToastItem – satu notifikasi
// ════════════════════════════════════════════════════════════
interface ToastItemProps extends Toast {
  onRemove: (id: string) => void;
}

function ToastItem({
  id,
  variant = "info",
  title,
  description,
  duration = 4000,
  onRemove,
}: ToastItemProps) {
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const intervalRef = useRef<number | null>(null);
  const { icon: Icon } = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  // Auto dismiss + progress bar
  useEffect(() => {
    if (!duration) return;

    const step = 100 / (duration / 50);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          dismiss();
          return 0;
        }
        return prev - step;
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, dismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[variant]} ${
        leaving ? styles.toastLeave : ""
      }`}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>

      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <button
        className={styles.dismiss}
        onClick={dismiss}
        aria-label="Tutup notifikasi"
      >
        <X size={15} />
      </button>

      {duration && (
        <div
          className={styles.progress}
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ToastProvider – letakkan di root
// ════════════════════════════════════════════════════════════
interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div
          className={styles.container}
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

// ════════════════════════════════════════════════════════════
// useToast – hook untuk mengakses addToast
// ════════════════════════════════════════════════════════════
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  }
  return ctx;
}
