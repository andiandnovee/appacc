import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Drawer.module.css";

/* ── Icon Close ────────────────────────────────────────────── */
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 3l10 10M13 3L3 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ════════════════════════════════════════════════════════════
   Drawer — komponen utama
   ════════════════════════════════════════════════════════════

   Props:
   - isOpen          → boolean — kontrol tampil/sembunyi (wajib)
   - onClose         → function — callback saat drawer ditutup (wajib)
   - size            → 'sm' | 'md' | 'lg' (default: 'md')
                       sm = 400px | md = 520px | lg = 680px
                       Di mobile (<768px) selalu jadi bottom sheet
   - closeOnBackdrop → boolean — klik backdrop menutup drawer (default: true)
   - children        → gunakan Drawer.Header, Drawer.Body, Drawer.Footer
*/
function Drawer({
  isOpen,
  onClose,
  size = "md",
  closeOnBackdrop = true,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}) {
  /* ── Lock scroll body saat drawer terbuka ───────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Tutup dengan Escape ────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  /* ── Klik backdrop ──────────────────────────────────────── */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`${styles.panel} ${styles[size]}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ════════════════════════════════════════════════════════════
   Drawer.Header
   ════════════════════════════════════════════════════════════

   Props:
   - title    → string
   - subtitle → string (opsional)
   - onClose  → function (wajib)
   - actions  → React node — slot sebelum tombol close
   - children → override konten header sepenuhnya
*/
function DrawerHeader({
  title,
  subtitle,
  onClose,
  actions,
  children,
}: {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {children ? (
          children
        ) : (
          <>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </>
        )}
      </div>
      <div className={styles.headerActions}>
        {actions}
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Tutup drawer"
          >
            <IconClose />
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Drawer.Body — konten utama, scrollable
   ════════════════════════════════════════════════════════════ */
function DrawerBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

/* ════════════════════════════════════════════════════════════
   Drawer.Footer
   ════════════════════════════════════════════════════════════

   Props:
   - align → 'right' | 'left' | 'between' (default: 'right')
*/
function DrawerFooter({
  align = "right",
  children,
}: {
  align?: "right" | "left" | "between";
  children: React.ReactNode;
}) {
  const cls = [
    styles.footer,
    align === "left" ? styles.footerLeft : "",
    align === "between" ? styles.footerBetween : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls}>{children}</div>;
}

/* ── Attach sub-komponen ───────────────────────────────────── */
Drawer.Header = DrawerHeader;
Drawer.Body   = DrawerBody;
Drawer.Footer = DrawerFooter;

export default Drawer;