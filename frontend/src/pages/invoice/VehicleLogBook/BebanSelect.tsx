/**
 * BebanSelect.tsx
 * Path: frontend/src/pages/vehicles/BebanSelect.tsx
 *
 * Unified async search untuk cost_center + customer.
 * Mengembalikan { sap_id, type, name } ke parent.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { Building2, Users } from "lucide-react";
import api from "../../../api/axios";
import styles from "./BebanSelect.module.css";

// ─────────────────────────────────────────────
export interface BebanOption {
  sap_id: string;
  type: "cost_center" | "customer";
  name: string;
  short_name: string | null;
}

interface Props {
  value: BebanOption | null;
  onChange: (val: BebanOption | null) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

// ─────────────────────────────────────────────
export default function BebanSelect({
  value,
  onChange,
  error,
  disabled,
  placeholder = "Cari cost center atau customer...",
}: Props) {
  const [inputValue, setInputValue]   = useState("");
  const [options, setOptions]         = useState<BebanOption[]>([]);
  const [isOpen, setIsOpen]           = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch ────────────────────────────────────
  const fetchOptions = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/vehicles/logbook/beban-search", {
        params: { q },
      });
      setOptions(data);
    } catch {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Input change ─────────────────────────────
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(null); // clear selection saat user ngetik ulang

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOptions(val), 250);
  };

  // ── Focus: buka dropdown + fetch awal ────────
  const handleFocus = () => {
    setIsOpen(true);
    if (options.length === 0) fetchOptions(inputValue);
  };

  // ── Pilih opsi ───────────────────────────────
  const handleSelect = (opt: BebanOption) => {
    onChange(opt);
    setInputValue(""); // input kosong, label ditampilkan dari value
    setIsOpen(false);
    setHighlightedIdx(null);
  };

  // ── Keyboard ─────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") { setIsOpen(true); setHighlightedIdx(0); }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIdx((p) => p === null ? 0 : Math.min(p + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIdx((p) => p === null ? options.length - 1 : Math.max(p - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIdx !== null && options[highlightedIdx]) {
          handleSelect(options[highlightedIdx]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // ── Click outside ────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        inputRef.current?.contains(e.target as Node)
      ) return;
      setIsOpen(false);
      setInputValue("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // ── Display value ────────────────────────────
  // Kalau ada pilihan & tidak sedang ngetik → tampilkan nama
  const displayValue = isOpen ? inputValue : (value ? "" : inputValue);
  const showChip = !isOpen && value !== null;

  // ─────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        Beban <span className={styles.req}>*</span>
      </label>

      <div className={`${styles.inputWrap} ${error ? styles.hasError : ""} ${disabled ? styles.disabled : ""}`}>
        {/* Chip nilai terpilih */}
        {showChip && (
          <span className={`${styles.chip} ${styles[`chip_${value!.type}`]}`}>
            {value!.type === "cost_center"
              ? <Building2 size={11} />
              : <Users size={11} />
            }
            <span className={styles.chipCode}>{value!.sap_id}</span>
            <span className={styles.chipName}>{value!.short_name ?? value!.name}</span>
            {!disabled && (
              <button
                type="button"
                className={styles.chipClear}
                onClick={() => { onChange(null); setInputValue(""); inputRef.current?.focus(); }}
              >×</button>
            )}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={showChip ? "" : placeholder}
          value={displayValue}
          onChange={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          style={{ width: showChip ? "1px" : "100%" }}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {isLoading && (
            <div className={styles.skeletonWrap}>
              {[...Array(4)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          )}

          {!isLoading && options.length === 0 && (
            <div className={styles.empty}>
              {inputValue ? `Tidak ada hasil untuk "${inputValue}"` : "Ketik untuk mencari..."}
            </div>
          )}

          {!isLoading && options.length > 0 && (
            <>
              {/* Group headers */}
              {renderGrouped(options, value, highlightedIdx, handleSelect, setHighlightedIdx)}
            </>
          )}
        </div>
      )}

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Render dengan group CC vs Customer
function renderGrouped(
  options: BebanOption[],
  selected: BebanOption | null,
  highlightedIdx: number | null,
  onSelect: (opt: BebanOption) => void,
  setHighlight: (i: number) => void,
) {
  const groups: { label: string; type: BebanOption["type"]; icon: React.ReactNode }[] = [
    { label: "Cost Center", type: "cost_center", icon: <Building2 size={12} /> },
    { label: "Customer",    type: "customer",    icon: <Users size={12} /> },
  ];

  // flat index tracking untuk keyboard
  let flatIdx = 0;

  return groups.map(({ label, type, icon }) => {
    const items = options.filter((o) => o.type === type);
    if (items.length === 0) return null;

    return (
      <div key={type}>
        <div className={styles.groupHeader}>
          {icon} {label}
        </div>
        {items.map((opt) => {
          const idx = flatIdx++;
          const isHighlighted = highlightedIdx === idx;
          const isSelected = selected?.sap_id === opt.sap_id && selected?.type === opt.type;

          return (
            <div
              key={`${opt.type}-${opt.sap_id}`}
              className={`${styles.option} ${isHighlighted ? styles.optionHighlighted : ""} ${isSelected ? styles.optionSelected : ""}`}
              onClick={() => onSelect(opt)}
              onMouseEnter={() => setHighlight(idx)}
            >
              <span className={styles.optionSapId}>{opt.sap_id}</span>
              <span className={styles.optionName}>{opt.name}</span>
              {opt.short_name && (
                <span className={styles.optionShort}>{opt.short_name}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  });
}