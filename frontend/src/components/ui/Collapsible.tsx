import { createContext, useContext, useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import styles from "./Collapsible.module.css";

const CollapsibleContext = createContext(null);
export const useCollapsible = () => useContext(CollapsibleContext);

export default function Collapsible({
  peekHeight = 120,
  defaultOpen = false,
  children,
  debug = false, // tambahkan prop debug
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(defaultOpen ? "auto" : `${peekHeight}px`);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef(null);

  // Fungsi pengukuran yang akan dipanggil berulang kali
  const measure = useCallback(() => {
    if (!contentRef.current) return;
    const fullH = contentRef.current.scrollHeight;
    const overflow = fullH > peekHeight;

    if (debug) {
      console.log("[Collapsible] measure:", { fullH, peekHeight, overflow, open });
    }

    setNeedsCollapse(overflow);
    if (!open && overflow) {
      setHeight(`${peekHeight}px`);
    } else {
      setHeight("auto");
    }
  }, [open, peekHeight, debug]);

  // Paksa ukur saat mount + setelah children berubah
  useLayoutEffect(() => {
    measure();
  }, [measure, children]);

  // Observer untuk perubahan ukuran konten (gambar, font, resize window)
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(contentRef.current);

    // Observasi perubahan atribut/tambahan node di dalam konten
    const mutationObserver = new MutationObserver(() => measure());
    mutationObserver.observe(contentRef.current, { childList: true, subtree: true, attributes: true });

    window.addEventListener("resize", measure);
    
    // Tangani gambar yang belum load
    const images = contentRef.current.querySelectorAll("img");
    const handleImageLoad = () => measure();
    images.forEach(img => {
      if (img.complete) return;
      img.addEventListener("load", handleImageLoad);
    });

    // Panggil measure setelah sedikit delay untuk memastikan font dll
    const timeout = setTimeout(measure, 100);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
      images.forEach(img => img.removeEventListener("load", handleImageLoad));
      clearTimeout(timeout);
    };
  }, [measure]);

  const toggle = () => {
    if (!contentRef.current) return;
    const fullH = contentRef.current.scrollHeight;
    if (!open) {
      setHeight(`${fullH}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight("auto"));
      });
    } else {
      setHeight(`${fullH}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(`${peekHeight}px`));
      });
    }
    setOpen(v => !v);
  };

  return (
    <CollapsibleContext.Provider value={{ open, toggle, needsCollapse }}>
      <div className={styles.root}>
        <div
          ref={contentRef}
          className={styles.body}
          style={{
            height,
            overflow: height === "auto" ? "visible" : "hidden",
            transition: "height 0.3s ease",
          }}
        >
          {children}
        </div>
        {needsCollapse && !open && (
          <div className={styles.fade} aria-hidden="true" />
        )}
      </div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  labelOpen = "Tampilkan lebih sedikit",
  labelClose = "Tampilkan selengkapnya",
  className = "",
  style = {},
}) {
  const ctx = useCollapsible();
  console.log("[Trigger] context exists?", !!ctx, "needsCollapse =", ctx?.needsCollapse);
  
  if (!ctx) {
    console.error("CollapsibleTrigger must be used inside <Collapsible>");
    return null;
  }
  if (!ctx.needsCollapse) return null;

  return (
    <button
      type="button"
      onClick={ctx.toggle}
      className={`${styles.trigger} ${className}`}
      style={style}
      aria-expanded={ctx.open}
    >
      <span>{ctx.open ? labelOpen : labelClose}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          transition: "transform 0.25s ease",
          transform: ctx.open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}