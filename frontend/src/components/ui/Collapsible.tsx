import { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./Collapsible.module.css";

interface CollapsibleProps {
  title: string | ReactNode;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  open?: boolean;           // ← controlled mode (opsional)
  onToggle?: (isOpen: boolean) => void;
  children: ReactNode;
}

export default function Collapsible({
  title,
  subtitle = undefined,
  badge = undefined,
  defaultOpen = true,
  open: controlledOpen = undefined,
  onToggle = undefined,
  children,
}: CollapsibleProps) {
  // kalau prop "open" dikirim dari luar → controlled mode
  // kalau tidak → uncontrolled, pakai state internal
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const [height, setHeight] = useState(open ? "auto" : "0px");
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={styles.collapsible}>
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