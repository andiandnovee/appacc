import {
  FC,
  ReactNode,
  ReactElement,
  useId,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import styles from "./Select.module.css";

// ======================== TYPES ========================

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FetchOptions {
  endpoint: string;
  searchParam?: string;
  filters?: Record<string, any>;
  limit?: number;
}

interface SelectProps {
  id?: string;
  value?: any;
  onChange?: (event: { target: { value: any } }) => void;
  options?: (string | Option)[];
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  required?: boolean;
  fetchOptions?: FetchOptions | null;
  [key: string]: any;
}

// ======================== API HELPER ========================

interface ApiError extends Error {
  status?: number;
  data?: any;
}

const getToken = () =>
  localStorage.getItem("appacc_token") ??
  sessionStorage.getItem("appacc_token");

const getApiBase = () =>
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const enhancedApi = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const apiBase = getApiBase();
  const method = options.method || "GET";

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    const error = new Error(json.message || "Request failed") as ApiError;
    error.status = response.status;
    error.data = json;
    throw error;
  }

  return json;
};

// ======================== STATIC SELECT ========================

interface StaticSelectProps {
  id: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  normalizedOptions: Option[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
  size: string;
  [key: string]: any;
}

function StaticSelect({
  id,
  value,
  onChange,
  normalizedOptions,
  placeholder,
  error,
  disabled,
  size,
  ...rest
}: StaticSelectProps) {
  const selectClass = [styles.select, styles[size], error ? styles.error : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClass}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

// ======================== ASYNC SELECT ========================

interface AsyncSelectProps {
  id: string;
  value: any;
  onChange: (event: { target: { value: any } }) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  fetchOptions: FetchOptions;
  size: string;
}

function AsyncSelect({
  id,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  fetchOptions,
  size,
}: AsyncSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedItemLabel, setSelectedItemLabel] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFetchedForValueRef = useRef(false);

  const {
    endpoint,
    searchParam = "search",
    filters = {},
    limit = 5,
  } = fetchOptions;

  const fetchData = useCallback(
    async (search = "", off = 0) => {
      if (!endpoint) return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append(searchParam, search);
        Object.entries(filters).forEach(([key, val]) => {
          if (val != null && val !== "") params.append(key, String(val));
        });
        params.append("limit", String(limit));
        params.append("offset", String(off));
        const res = await enhancedApi(`${endpoint}?${params.toString()}`);
        const data = res.data || [];
        const mapped: Option[] = data.map((item: any) => ({
          value: item.id,
          label: item.name || item.label,
        }));
        setDropdownOptions((prev) =>
          off === 0 ? mapped : [...prev, ...mapped]
        );
        setHasMore(data.length === limit);
        setOffset(off + limit);
      } catch (e) {
        console.error("Fetch failed:", e);
        setDropdownOptions([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, searchParam, filters, limit]
  );

  const handleSelectOption = useCallback(
    (val: any) => {
      const selected = dropdownOptions.find(
        (opt) => String(opt.value) === String(val)
      );
      setSelectedItemLabel(selected?.label || "");
      onChange({ target: { value: val } });
      setIsOpen(false);
      setInputValue("");
      setHighlightedIndex(null);
    },
    [dropdownOptions, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" && dropdownOptions.length > 0) {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (dropdownOptions.length === 0) break;
          setHighlightedIndex((prev) =>
            prev === null ? 0 : Math.min(prev + 1, dropdownOptions.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          if (dropdownOptions.length === 0) break;
          setHighlightedIndex((prev) =>
            prev === null ? dropdownOptions.length - 1 : Math.max(prev - 1, 0)
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex !== null && dropdownOptions[highlightedIndex]) {
            handleSelectOption(dropdownOptions[highlightedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setInputValue("");
          break;
        default:
          break;
      }
    },
    [isOpen, dropdownOptions, highlightedIndex, handleSelectOption]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      setOffset(0);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => fetchData(val, 0), 300);
    },
    [fetchData]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (
        el.scrollHeight - el.scrollTop <= el.clientHeight + 50 &&
        hasMore &&
        !isLoading
      ) {
        fetchData(inputValue, offset);
      }
    },
    [hasMore, isLoading, fetchData, inputValue, offset]
  );

  // Effects
  useEffect(() => {
    setHighlightedIndex(null);
  }, [dropdownOptions]);

  useEffect(() => {
    if (!isOpen) setHighlightedIndex(null);
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex !== null && dropdownContentRef.current) {
      const children = dropdownContentRef.current.children;
      const el = children[highlightedIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (!value) {
      setSelectedItemLabel("");
      hasFetchedForValueRef.current = false;
      return;
    }
    const found = dropdownOptions.find(
      (opt) => String(opt.value) === String(value)
    );
    if (found) {
      setSelectedItemLabel(found.label);
      hasFetchedForValueRef.current = true;
    } else {
      setSelectedItemLabel(String(value));
    }
  }, [value, dropdownOptions]);

  useEffect(() => {
    if (!value || !endpoint) return;
    const hasLabel = dropdownOptions.some(
      (opt) => String(opt.value) === String(value)
    );
    if (hasLabel || hasFetchedForValueRef.current) return;
    hasFetchedForValueRef.current = true;
    const fetchById = async () => {
      try {
        const res = await enhancedApi(`${endpoint}/${value}`);
        const item = res.data || res;
        const label = item.name || item.label;
        setSelectedItemLabel(label);
        setDropdownOptions((prev) => {
          const exists = prev.some(
            (opt) => String(opt.value) === String(item.id)
          );
          return exists ? prev : [{ value: item.id, label }, ...prev];
        });
      } catch (e) {
        console.error("Fetch by ID failed:", e);
      }
    };
    fetchById();
  }, [value, endpoint, dropdownOptions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setInputValue("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    setOffset(0);
    setInputValue("");
    setDropdownOptions([]);
  }, [JSON.stringify(filters), endpoint]);

  const displayLabel = isOpen ? inputValue : selectedItemLabel || inputValue;
  const inputClass = [
    styles.asyncInput,
    styles[size],
    error ? styles.error : "",
    isOpen ? styles.open : "",
  ]
    .filter(Boolean)
    .join(" ");
  const dropdownClass = [styles.asyncDropdown, isOpen ? styles.visible : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.asyncContainer}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={inputClass}
        placeholder={placeholder}
        value={displayLabel}
        onChange={handleSearch}
        onFocus={() => {
          setIsOpen(true);
          setInputValue("");
          if (endpoint) fetchData("", 0);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        aria-expanded={isOpen}
        aria-invalid={!!error}
      />
      <div ref={dropdownRef} className={dropdownClass} onScroll={handleScroll}>
        <div ref={dropdownContentRef}>
          {isLoading && offset === 0 && (
            <div className={styles.skeletonContainer}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.skeletonItem} />
              ))}
            </div>
          )}
          {!isLoading && dropdownOptions.length === 0 && (
            <div className={styles.noResults}>Tidak ada data</div>
          )}
          {dropdownOptions.map((opt, index) => (
            <div
              key={opt.value}
              className={`${styles.asyncOption} ${
                value === opt.value ? styles.selected : ""
              } ${highlightedIndex === index ? styles.highlighted : ""}`}
              onClick={() => handleSelectOption(opt.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {opt.label}
            </div>
          ))}
          {isLoading && offset > 0 && (
            <div className={styles.loadingMore}>
              <div className={styles.spinner} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================== MAIN SELECT COMPONENT ========================

const Select: FC<SelectProps> = ({
  value,
  onChange,
  options = [],
  label,
  placeholder = "Pilih...",
  hint,
  error,
  size = "md",
  disabled = false,
  required = false,
  fetchOptions = null,
  ...rest
}) => {
  const id = useId();

  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string"
      ? { value: opt, label: opt, disabled: false }
      : { value: opt.value, label: opt.label, disabled: opt.disabled ?? false }
  );

  return (
    <div className={styles.wrapper}>
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${required ? styles.labelRequired : ""}`}
        >
          {label}
        </label>
      )}

      {fetchOptions ? (
        <AsyncSelect
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          fetchOptions={fetchOptions}
          size={size}
        />
      ) : (
        <StaticSelect
          id={id}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
          normalizedOptions={normalizedOptions}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          size={size}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...rest}
        />
      )}

      {error && (
        <p
          id={`${id}-error`}
          className={`${styles.message} ${styles.messageError}`}
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${id}-hint`} className={`${styles.message} ${styles.messageHint}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;