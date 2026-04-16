import { useState, FC, ReactNode } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import styles from "./Alert.module.css";

type AlertVariant = "success" | "warning" | "danger" | "info";

interface VariantConfig {
  icon: FC<{ size: number }>;
  label: string;
}

/* ── Icon & config per variant ─────────────────────────────── */
const VARIANT_CONFIG: Record<AlertVariant, VariantConfig> = {
  success: { icon: CheckCircle, label: "Success" },
  warning: { icon: AlertTriangle, label: "Warning" },
  danger: { icon: XCircle, label: "Error" },
  info: { icon: Info, label: "Info" },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Alert — komponen inline
 *
 * Props:
 * - variant      → 'success' | 'warning' | 'danger' | 'info' (default: 'info')
 * - title        → judul alert (opsional)
 * - description  → pesan alert
 * - dismissible  → boolean — tampilkan tombol × (default: false)
 * - onDismiss    → callback saat dismiss (opsional)
 */
const Alert: FC<AlertProps> = ({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const { icon: Icon, label } = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info;

  const handleDismiss = (): void => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>

      {/* Content */}
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Dismiss */}
      {dismissible && (
        <button
          className={styles.dismiss}
          onClick={handleDismiss}
          aria-label={`Tutup alert ${label}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
