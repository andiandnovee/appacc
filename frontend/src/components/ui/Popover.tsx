import {
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Popover.module.css";

// ---------------------------------------------------------------------------
// Helper: hitung posisi panel (fixed) relatif terhadap trigger dengan auto-flip
// ---------------------------------------------------------------------------
type Position =
  | "bottom"
  | "left"
  | "right"
  | "top"
  | "bottomStart"
  | "bottomEnd"
  | "topStart"
  | "topEnd";

interface Coords {
  top: number;
  left: number;
}

function computePosition(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  preferredPosition: Position,
  viewportWidth: number = window.innerWidth,
  viewportHeight: number = window.innerHeight,
  gap: number = 8,
): Coords {
  // Default: bottomStart
  let top = triggerRect.bottom + gap;
  let left = triggerRect.left;

  // Tentukan berdasarkan position
  switch (preferredPosition) {
    case "top":
    case "topStart":
      top = triggerRect.top - panelHeight - gap;
      left = triggerRect.left;
      break;
    case "topEnd":
      top = triggerRect.top - panelHeight - gap;
      left = triggerRect.right - panelWidth;
      break;
    case "bottom":
    case "bottomStart":
      top = triggerRect.bottom + gap;
      left = triggerRect.left;
      break;
    case "bottomEnd":
      top = triggerRect.bottom + gap;
      left = triggerRect.right - panelWidth;
      break;
    case "left":
      top = triggerRect.top + triggerRect.height / 2 - panelHeight / 2;
      left = triggerRect.left - panelWidth - gap;
      break;
    case "right":
      top = triggerRect.top + triggerRect.height / 2 - panelHeight / 2;
      left = triggerRect.right + gap;
      break;
    default:
      break;
  }

  // ---------- Auto-flip & shift agar tetap dalam viewport ----------
  const margin = 8; // jarak aman dari tepi layar

  // Flip horizontal jika melebihi kanan/kiri
  if (left + panelWidth > viewportWidth - margin) {
    // Coba geser ke kiri dengan menjaga tepi kanan panel di dalam viewport
    left = viewportWidth - panelWidth - margin;
  }
  if (left < margin) {
    left = margin;
  }

  // Flip vertical jika melebihi bawah/atas
  if (top + panelHeight > viewportHeight - margin) {
    // Coba tempatkan di atas trigger
    const topAlt = triggerRect.top - panelHeight - gap;
    if (topAlt > margin) {
      top = topAlt;
    } else {
      // Jika tidak muat di atas, paksa di bawah dan geser ke bawah
      top = viewportHeight - panelHeight - margin;
    }
  }
  if (top < margin) {
    top = margin;
  }

  return { top, left };
}

// ---------------------------------------------------------------------------
// Komponen Popover
// ---------------------------------------------------------------------------
interface PopoverProps {
  trigger?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  position?: Position;
  showClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  title,
  children,
  position = "bottomStart",
  showClose = true,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [ready, setReady] = useState(false); // untuk mencegah flicker

  const close = useCallback(() => {
    if (controlledOpen === undefined) setInternalOpen(false);
    onOpenChange?.(false);
  }, [controlledOpen, onOpenChange]);

  const toggleOpen = (e: ReactMouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isOpen;
    if (controlledOpen === undefined) setInternalOpen(nextState);
    onOpenChange?.(nextState);
  };

  // Klik di luar
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    if (isOpen) {
      const timer = setTimeout(
        () => document.addEventListener("click", handleOutsideClick),
        0,
      );
      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [isOpen, close]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, close]);

  // Hitung posisi setelah panel ter-render (dengan portal)
  useLayoutEffect(() => {
    if (!isOpen || !wrapperRef.current || !panelRef.current) {
      setReady(false);
      return;
    }

    const triggerEl = wrapperRef.current
      .firstElementChild as HTMLElement | null;
    if (!triggerEl) return;

    const panel = panelRef.current;
    const triggerRect = triggerEl.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect(); // ukuran asli (belum diposisikan)

    // Hitung posisi ideal
    const newCoords = computePosition(
      triggerRect,
      panelRect.width,
      panelRect.height,
      position,
    );

    setCoords(newCoords);
    setReady(true);
  }, [isOpen, position]);

  // Reset ready saat tutup
  useEffect(() => {
    if (!isOpen) setReady(false);
  }, [isOpen]);

  const panelContent = (
    <div
      ref={panelRef}
      className={`${styles.popover} ${styles[position]}`}
      style={{
        position: "fixed",
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        zIndex: 9999,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.15s",
        visibility: ready ? "visible" : "hidden",
      }}
      role="dialog"
      onClick={(e) => e.stopPropagation()}
    >
      {(title || showClose) && (
        <div className={styles.header}>
          {title && <p className={styles.title}>{title}</p>}
          {showClose && (
            <button
              className={styles.closeBtn}
              type="button"
              onClick={close}
              aria-label="Tutup"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <span
        onClick={toggleOpen}
        style={{ display: "inline-flex", cursor: "pointer" }}
      >
        {trigger}
      </span>
      {isOpen && createPortal(panelContent, document.body)}
    </div>
  );
};
