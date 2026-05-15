import { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./Collapsible.module.css";

interface CollapsibleProps {
  title: string | ReactNode;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: ReactNode;
}

/**
 * Collapsible
 * Wrapper dengan header menyatu — tanpa garis pemisah antara header & content.
 *
 * Props:
 *   title        {string|ReactNode}  - judul header (wajib)
 *   subtitle     {string}            - teks kecil di bawah title (opsional)
 *   badge        {string}            - pill kecil di sebelah title (opsional)
 *   defaultOpen  {boolean}           - state awal, default true
 *   onToggle     {function}          - callback(isOpen) saat toggle (opsional)
 *   children     {ReactNode}
 *
 * Usage:
 *   <Collapsible title="Informasi Vendor" subtitle="PT. Maju Bersama">
 *     <VendorCard />
 *   </Collapsible>
 */
export default function Collapsible({
  title,
  subtitle = undefined,
  badge = undefined,
  defaultOpen = true,
  onToggle = undefined,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(defaultOpen ? "auto" : "0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const scrollH = contentRef.current.scrollHeight;
      setHeight(`${scrollH}px`);
      const t = setTimeout(() => setHeight("auto"), 280);
      return () => clearTimeout(t);
    } else {
      setHeight(`${contentRef.current.scrollHeight}px`);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setHeight("0px"))
      );
    }
  }, [open]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={styles.collapsible}>
      {/* Header — menyatu tanpa border-bottom */}
      <button
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={open}
        type="button"
      >
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
            {badge && <span className={styles.badge}>{badge}</span>}
          </div>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>

        <span
          className={styles.chevron}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Content — animated */}
      <div
        ref={contentRef}
        className={styles.contentWrapper}
        style={{
          height,
          overflow: height === "auto" ? "visible" : "hidden",
        }}
        aria-hidden={!open}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}