import { useState, FC, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

interface AccordionItem {
  key: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items?: AccordionItem[];
  multiple?: boolean;
  variant?: "default" | "bordered";
  defaultOpen?: string[];
}

/**
 * Accordion
 *
 * Props:
 * - items     → array of { key, label, icon?, content }
 * - multiple  → boolean — bisa buka lebih dari satu sekaligus (default: false)
 * - variant   → 'default' | 'bordered' (default: 'bordered')
 * - defaultOpen → array of key yang terbuka default
 */
const Accordion: FC<AccordionProps> = ({
  items = [],
  multiple = false,
  variant = "bordered",
  defaultOpen = [],
}) => {
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpen);

  const toggle = (key: string): void => {
    if (multiple) {
      setOpenKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
    } else {
      setOpenKeys((prev) => (prev.includes(key) ? [] : [key]));
    }
  };

  return (
    <div
      className={`${styles.accordion} ${variant === "bordered" ? styles.bordered : ""}`}
    >
      {items.map((item) => {
        const isOpen = openKeys.includes(item.key);
        return (
          <div key={item.key} className={styles.item}>
            <button
              className={styles.trigger}
              onClick={() => toggle(item.key)}
              aria-expanded={isOpen}
              aria-controls={`acc-${item.key}`}
              id={`acc-btn-${item.key}`}
            >
              <span className={styles.triggerLeft}>
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </span>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                aria-hidden="true"
              />
            </button>

            <div
              id={`acc-${item.key}`}
              role="region"
              aria-labelledby={`acc-btn-${item.key}`}
              className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}
            >
              <div className={styles.contentInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
