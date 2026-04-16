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

interface SelectProps {
  id?: any;
  value?: any;
  onChange?: any;
  normalizedOptions?: any;
  placeholder?: any;
  error?: any;
  disabled?: any;
  size?: any;
  rest?: any;
}



/**
 * Select Component - Async Searchable with Scroll Pagination
 *
 * Props:
 * - value, onChange          → controlled select (required)
 * - options                  → array of strings or objects { value, label, disabled }
 * - label                    → text label above select
 * - placeholder              → text for first disabled option (default: 'Pilih...')
 * - hint                     → helper text below
 * - error                    → error message
 * - size                     → 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled                 → boolean
 * - required                 → boolean
 * - fetchOptions             → object for async search
 *     {
 *       endpoint: '/api/vendors',       // required
 *       searchParam: 'search',          // query param name (default: 'search')
 *       filters: { company_id: 1 },    // additional filters (optional, skipped if value is falsy)
 *       limit: 5                        // initial limit (default: 5)
 *     }
 * - ...rest                  → other props passed to input/select
 *
 * Examples:
 * - Static: options={['Active', 'Inactive']}
 * - Static: options={[{ value: 'a', label: 'Admin' }, { value: 'u', label: 'User' }]}
 * - Async: fetchOptions={{ endpoint: '/vendors', searchParam: 'search', filters: { company_id: form.company_id } }}
 */

const getToken = () =>
  localStorage.getItem("appacc_token") ??
  sessionStorage.getItem("appacc_token");

const getApiBase = () =>
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const enhancedApi = (path, options = {}) => {
  const token = getToken();
  const apiBase = getApiBase();
  const method = options.method || "GET";

  // Only add Content-Type for requests with body
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${apiBase}${path}`, {
    ...options,
    headers,
  }).then((r) =>
    r.json().then((json) => {
      if (!r.ok) {
        const error = new Error(json.message || "Request failed");
        error.status = r.status;
        error.data = json;
        throw error;
      }
      return json;
    }),
  );
};

/**
 * Static Select (backward compatible)
 */
function StaticSelect({
  id,
  value,
  onChange,
  normalizedOptions,
  placeholder,
  error,
  disabled,
  size,
  rest,
}) {
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

/**
 * Async Searchable Select (new feature)
 */
function AsyncSelect({
  id,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  fetchOptions,
  size,
}) {
  // ✅ 1. ALL useState hooks FIRST (so dropdownOptions exists for later functions)
  const [inputValue, setInputValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]); // <-- declared FIRST
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedItemLabel, setSelectedItemLabel] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // ✅ 2. useRef hooks
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const debounceTimer = useRef(null);
  const prevValueRef = useRef(null);
  const prevDropdownRef = useRef([]);
  const hasFetchedForValueRef = useRef(false);

  const {
    endpoint,
    searchParam = "search",
    filters = {},
    limit = 5,
  } = fetchOptions;

  // ✅ 3. fetchData and fetchItemById (using useCallback)
  const fetchData = useCallback(
    async (search = "", off = 0) => {
      if (!endpoint) return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append(searchParam, search);
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.append(key, val);
        });
        params.append("limit", limit);
        params.append("offset", off);
        const res = await enhancedApi(`${endpoint}?${params.toString()}`);
        const data = res.data || [];
        const mapped = data.map((item) => ({
          value: item.id,
          label: item.name || item.label,
        }));
        setDropdownOptions((prev) =>
          off === 0 ? mapped : [...prev, ...mapped],
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
    [endpoint, searchParam, filters, limit],
  );

  const fetchItemById = useCallback(
    async (id) => {
      if (!endpoint || !id) return null;
      try {
        const res = await enhancedApi(`${endpoint}/${id}`);
        const item = res.data || res;
        return { value: item.id, label: item.name || item.label };
      } catch (e) {
        console.error("Fetch item by ID failed:", e);
        return null;
      }
    },
    [endpoint],
  );

  // ✅ 4. handleSelectOption (uses dropdownOptions, defined after it)
  const handleSelectOption = useCallback(
    (val) => {
      const selected = dropdownOptions.find(
        (opt) => String(opt.value) === String(val),
      );
      setSelectedItemLabel(selected?.label || "");
      onChange({ target: { value: val } });
      setIsOpen(false);
      setInputValue("");
      setHighlightedIndex(null);
    },
    [dropdownOptions, onChange],
  );

  // ✅ 5. handleKeyDown (uses dropdownOptions, defined AFTER its declaration)
  const handleKeyDown = useCallback(
    (e) => {
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
            prev === null ? 0 : Math.min(prev + 1, dropdownOptions.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          if (dropdownOptions.length === 0) break;
          setHighlightedIndex((prev) =>
            prev === null ? dropdownOptions.length - 1 : Math.max(prev - 1, 0),
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
    [isOpen, dropdownOptions, highlightedIndex, handleSelectOption],
  );

  // ✅ 6. handleSearch (no dependency on dropdownOptions)
  const handleSearch = useCallback(
    (e) => {
      const val = e.target.value;
      setInputValue(val);
      setOffset(0);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => fetchData(val, 0), 300);
    },
    [fetchData],
  );

  // ✅ 7. handleScroll
  const handleScroll = useCallback(
    (e) => {
      const el = e.target;
      if (
        el.scrollHeight - el.scrollTop <= el.clientHeight + 50 &&
        hasMore &&
        !isLoading
      ) {
        fetchData(inputValue, offset);
      }
    },
    [hasMore, isLoading, fetchData, inputValue, offset],
  );

  // ✅ 8. Effects (useEffect) – all after functions
  useEffect(() => {
    setHighlightedIndex(null);
  }, [dropdownOptions]);

  useEffect(() => {
    if (!isOpen) setHighlightedIndex(null);
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex !== null && dropdownContentRef.current) {
      const el = dropdownContentRef.current.children[highlightedIndex];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // Sync selected label with value
  useEffect(() => {
    if (!value) {
      setSelectedItemLabel("");
      hasFetchedForValueRef.current = false;
      return;
    }
    const found = dropdownOptions.find(
      (opt) => String(opt.value) === String(value),
    );
    if (found) {
      setSelectedItemLabel(found.label);
      hasFetchedForValueRef.current = true;
    } else {
      setSelectedItemLabel(String(value));
      hasFetchedForValueRef.current = false;
    }
    prevValueRef.current = value;
  }, [value, dropdownOptions]);

  // Fetch by ID when needed
  useEffect(() => {
    if (!value || !endpoint) return;
    const hasLabel = dropdownOptions.some(
      (opt) => String(opt.value) === String(value),
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
            (opt) => String(opt.value) === String(item.id),
          );
          return exists ? prev : [{ value: item.id, label }, ...prev];
        });
      } catch (e) {
        console.error("Fetch by ID failed:", e);
      }
    };
    fetchById();
  }, [value, endpoint, dropdownOptions]);

  // Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setInputValue("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Reset on filters/endpoint change
  useEffect(() => {
    setOffset(0);
    setInputValue("");
    setDropdownOptions([]);
    prevDropdownRef.current = [];
  }, [JSON.stringify(filters), endpoint]);

  // ✅ 9. Render
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
              className={`${styles.asyncOption} ${value === opt.value ? styles.selected : ""} ${highlightedIndex === index ? styles.highlighted : ""}`}
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
  rest,
}) => {
  const id = useId();

  // Normalize static options
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string"
      ? { value: opt, label: opt, disabled: false }
      : { value: opt.value, label: opt.label, disabled: opt.disabled ?? false },
  );

  return (
    <div className={styles.wrapper}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${required ? styles.labelRequired : ""}`}
        >
          {label}
        </label>
      )}

      {/* Select Type - Static or Async */}
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
          onChange={onChange}
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

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          className={`${styles.message} ${styles.messageError}`}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Hint message */}
      {!error && hint && (
        <p
          id={`${id}-hint`}
          className={`${styles.message} ${styles.messageHint}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;