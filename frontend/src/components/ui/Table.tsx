// Table.tsx
import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  ReactNode,
  useMemo,
  useId,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { utils, writeFile } from "xlsx";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  XCircle,
  Filter,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  Columns3,
  Eye,
  EyeOff,
  LayoutList,
  LayoutGrid,
  Table2,
  Info,
} from "lucide-react";
import { useTableData } from "./useTableData";
import Card from "./Card";
import Button from "./Button";
import { Popover } from "./Popover";
import { useTablePrefsStore } from "../../stores/tablePrefs";
import { useShallow } from "zustand/react/shallow";
import styles from "./Table.module.css";

// ========== DEBOUNCE ==========
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ========== MOBILE DETECT ==========
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

// ========== OVERFLOW-BASED AUTO COLLAPSE HOOK ==========
// ========== OVERFLOW-BASED AUTO COLLAPSE HOOK (FIXED) ==========
function useOverflowCollapse(
  scrollRef: React.RefObject<HTMLElement | null>,
  columns: Column[],
  manualHidden: Set<string>,
): Set<string> {
  const [autoHidden, setAutoHidden] = useState<Set<string>>(new Set());
  const colWidthsRef = useRef<Map<string, number>>(new Map());
  const lastClientWidthRef = useRef<number>(-1);
  const lastScrollWidthRef = useRef<number>(-1);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoringRef = useRef(false); // prevent simultaneous restore attempts

  const collapsibleQueue = useMemo(() => {
    return columns
      .map((col, index) => ({ col, index }))
      .filter(({ col }) => col.collapsible && !manualHidden.has(col.key))
      .sort((a, b) => {
        const orderA = a.col.collapseOrder ?? columns.length - a.index;
        const orderB = b.col.collapseOrder ?? columns.length - b.index;
        return orderB - orderA;
      });
  }, [columns, manualHidden]);

  const collapsibleQueueRef = useRef(collapsibleQueue);
  useEffect(() => {
    collapsibleQueueRef.current = collapsibleQueue;
  }, [collapsibleQueue]);

  const autoHiddenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measureColWidths = () => {
      const ths = el.querySelectorAll<HTMLTableCellElement>(
        "thead tr:first-child th",
      );
      ths.forEach((th) => {
        const key = th.dataset.colkey;
        if (key)
          colWidthsRef.current.set(key, th.getBoundingClientRect().width);
      });
    };

    const run = () => {
      const clientWidth = el.clientWidth;
      const scrollWidth = el.scrollWidth;

      // Skip if nothing changed (width stable)
      if (
        clientWidth === lastClientWidthRef.current &&
        scrollWidth === lastScrollWidthRef.current
      ) {
        return;
      }
      lastClientWidthRef.current = clientWidth;
      lastScrollWidthRef.current = scrollWidth;

      measureColWidths();

      const queue = collapsibleQueueRef.current;
      const currentHidden = new Set(autoHiddenRef.current);
      const isOverflowing = () => scrollWidth > clientWidth + 1;

      if (isOverflowing()) {
        // Cancel any pending restore timer
        if (restoreTimerRef.current) {
          clearTimeout(restoreTimerRef.current);
          restoreTimerRef.current = null;
        }
        isRestoringRef.current = false;

        const next = new Set(currentHidden);
        for (const { col } of queue) {
          if (next.has(col.key)) continue;
          next.add(col.key);
          break; // hide one column per cycle
        }
        if (next.size !== currentHidden.size) {
          autoHiddenRef.current = next;
          setAutoHidden(new Set(next));
        }
      } else {
        // Not overflowing – maybe restore columns with hysteresis
        const slack = clientWidth - scrollWidth;
        if (slack <= 0 || currentHidden.size === 0) return;

        const restoreQueue = [...queue]
          .filter(({ col }) => currentHidden.has(col.key))
          .reverse();

        if (restoreQueue.length === 0) return;

        // Avoid multiple restore timers; use a cooldown to ensure stability
        if (!restoreTimerRef.current && !isRestoringRef.current) {
          restoreTimerRef.current = setTimeout(() => {
            restoreTimerRef.current = null;
            // Re-measure to ensure situation still stable
            const newClientWidth = el.clientWidth;
            const newScrollWidth = el.scrollWidth;
            if (newScrollWidth > newClientWidth + 1) {
              // Overflow again, abort
              return;
            }

            const newSlack = newClientWidth - newScrollWidth;
            // Find the first column that fits with a margin of 10px
            for (const { col } of restoreQueue) {
              const colWidth = colWidthsRef.current.get(col.key) ?? 150;
              if (colWidth + 10 <= newSlack) {
                const next = new Set(autoHiddenRef.current);
                next.delete(col.key);
                autoHiddenRef.current = next;
                setAutoHidden(new Set(next));
                isRestoringRef.current = false;
                return;
              }
            }
            // No column fits, give up
          }, 200); // 200ms cooldown
          isRestoringRef.current = true;
        }
      }
    };

    const observer = new ResizeObserver(() => requestAnimationFrame(run));
    observer.observe(el);
    // Initial run
    requestAnimationFrame(run);
    return () => {
      observer.disconnect();
      lastClientWidthRef.current = -1;
      lastScrollWidthRef.current = -1;
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    };
  }, [scrollRef]);

  // Reset autoHidden when collapsibleQueue changes (e.g., manual hide toggles)
  useEffect(() => {
    lastClientWidthRef.current = -1;
    setAutoHidden((prev) => {
      const validKeys = new Set(collapsibleQueue.map((c) => c.col.key));
      const next = new Set([...prev].filter((k) => validKeys.has(k)));
      autoHiddenRef.current = next;
      return next;
    });
  }, [collapsibleQueue]);

  return autoHidden;
}

// ========== EXPORT PDF ==========
function exportToPdf(
  rows: Record<string, any>[],
  cols: { key: string; label: string }[],
  exportName: string,
) {
  const colLabels = cols.map((c) => c.label);
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${colLabels.map((label) => `<td>${row[label] ?? ""}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `
    <!DOCTYPE html><html><head>
    <meta charset="UTF-8" /><title>${exportName}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #111; padding: 24px; }
      h2 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
      table { border-collapse: collapse; width: 100%; }
      thead tr { background: #f3f4f6; }
      th { border: 1px solid #d1d5db; padding: 6px 10px; font-size: 11px; font-weight: 600; text-align: left; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; white-space: nowrap; }
      td { border: 1px solid #e5e7eb; padding: 5px 10px; font-size: 11px; color: #374151; vertical-align: middle; }
      tr:nth-child(even) td { background: #f9fafb; }
      .meta { margin-top: 16px; font-size: 10px; color: #9ca3af; }
      @media print { body { padding: 12px; } @page { margin: 1cm; } }
    </style>
    </head><body>
    <h2>${exportName}</h2>
    <table>
      <thead><tr>${colLabels.map((l) => `<th>${l}</th>`).join("")}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p class="meta">Diekspor pada: ${new Date().toLocaleString("id-ID")} · Total: ${rows.length} data</p>
    <script>window.onload=function(){setTimeout(function(){window.print();window.onafterprint=function(){window.close();};},300);};<\/script>
    </body></html>
  `;
  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up diblokir browser. Izinkan pop-up untuk export PDF.");
    return;
  }
  win.document.write(html);
  win.document.close();
}

// ========== INTERFACES ==========
export type CardRole = "title" | "subtitle" | "badge" | "field" | "hidden";
export type ViewMode = "table" | "grid" | "list";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any, refetch?: () => void) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: Array<{ value: string; label: string }>;
  filterPlaceholder?: string;
  exportable?: boolean;
  exportValue?: (row: any) => string | number | null;
  collapsible?: boolean;
  collapseOrder?: number;
  /**
   * cardRole — menentukan posisi kolom ini dalam card view:
   *   'title'    → baris utama (bold, besar) di header card
   *   'subtitle' → baris kedua di header card (muted)
   *   'badge'    → badge kecil di pojok kanan header card
   *   'field'    → label–value pair di body card (default untuk semua kolom)
   *   'hidden'   → tidak ditampilkan di card view (tetap muncul di tabel)
   */
  cardRole?: CardRole;
}

interface TableProps {
  url?: string;
  columns?: Column[];
  dataKey?: string;
  pageSize?: number;
  exportName?: string;
  title?: string;
  searchable?: boolean;
  selectable?: boolean;
  defaultParams?: Record<string, any>;
  serverSide?: boolean;
  rowIdKey?: string;
  serverSideFiltering?: boolean;
  filterDebounceMs?: number;
  /** Mode tampilan awal. Default: 'table' */
  defaultView?: ViewMode;
  /** Tampilkan tombol toggle Table/Grid/List. Default: true */
  allowViewToggle?: boolean;
  /**
   * ID unik tabel — dipakai sebagai key di tablePrefs Zustand store.
   * Kalau tidak diisi, preferensi tidak di-persist.
   */
  tableId?: string;
}

// ========== COLUMN VISIBILITY PANEL ==========
interface ColVisibilityPanelProps {
  columns: Column[];
  manualHidden: Set<string>;
  autoHidden: Set<string>;
  effectiveHidden: Set<string>;
  onToggle: (key: string) => void;
  onClose: () => void;
}

function ColVisibilityPanel({
  columns,
  manualHidden,
  autoHidden,
  effectiveHidden,
  onToggle,
  onClose,
}: ColVisibilityPanelProps) {
  const collapsibleCols = columns.filter((c) => c.collapsible);
  return (
    <div className={styles.colPanel}>
      <div className={styles.colPanelHeader}>
        <span className={styles.colPanelTitle}>Tampilkan Kolom</span>
        <button className={styles.colPanelClose} onClick={onClose}>
          <XCircle size={14} />
        </button>
      </div>
      <div className={styles.colPanelList}>
        {collapsibleCols.map((col) => {
          const isHidden = effectiveHidden.has(col.key);
          const isAutoHidden =
            autoHidden.has(col.key) && !manualHidden.has(col.key);
          const isForcedVisible =
            autoHidden.has(col.key) && manualHidden.has(col.key);
          return (
            <button
              key={col.key}
              className={`${styles.colPanelItem} ${isHidden ? styles.colPanelItemHidden : ""}`}
              onClick={() => onToggle(col.key)}
              title={
                isAutoHidden
                  ? "Disembunyikan otomatis karena tabel terlalu lebar"
                  : isForcedVisible
                    ? "Dipaksa tampil (tabel mungkin overflow)"
                    : undefined
              }
            >
              {isHidden ? (
                <EyeOff size={13} className={styles.colPanelIcon} />
              ) : (
                <Eye size={13} className={styles.colPanelIcon} />
              )}
              <span>{col.label}</span>
              {isAutoHidden && (
                <span className={styles.colPanelAutoTag}>auto</span>
              )}
              {isForcedVisible && (
                <span className={styles.colPanelForceTag}>paksa</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ========== CARD HEADER DETAIL POPOVER ==========
interface CardHeaderPopoverProps {
  titleCol?: Column;
  subtitleCol?: Column;
  badgeCols: Column[];
  row: any;
  refetch: () => void;
}

function CardHeaderPopover({
  titleCol,
  subtitleCol,
  badgeCols,
  row,
  refetch,
}: CardHeaderPopoverProps) {
  const hasContent = titleCol || subtitleCol || badgeCols.length > 0;
  if (!hasContent) return null;

  const renderVal = (col: Column) =>
    col.render ? col.render(row, refetch) : String(row[col.key] ?? "—");

  return (
    <Popover
      trigger={
        <button
          className={styles.cardInfoBtn}
          type="button"
          aria-label="Lihat detail header"
        >
          <Info size={12} />
        </button>
      }
      position="bottomEnd"
      showClose={false}
    >
      <div className={styles.cardInfoPopover}>
        {titleCol && (
          <div className={styles.cardInfoRow}>
            <span className={styles.cardInfoLabel}>{titleCol.label}</span>
            <span className={styles.cardInfoValue}>{renderVal(titleCol)}</span>
          </div>
        )}
        {subtitleCol && (
          <div className={styles.cardInfoRow}>
            <span className={styles.cardInfoLabel}>{subtitleCol.label}</span>
            <span className={styles.cardInfoValue}>
              {renderVal(subtitleCol)}
            </span>
          </div>
        )}
        {badgeCols.map((col) => (
          <div key={col.key} className={styles.cardInfoRow}>
            <span className={styles.cardInfoLabel}>{col.label}</span>
            <span className={styles.cardInfoValue}>{renderVal(col)}</span>
          </div>
        ))}
      </div>
    </Popover>
  );
}

// ========== CARD VIEW — SINGLE CARD ==========
interface DataCardProps {
  row: any;
  columns: Column[];
  refetch: () => void;
  view: "grid" | "list";
  selectable?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  rowIdKey?: string;
}

function DataCard({
  row,
  columns,
  refetch,
  view,
  selectable,
  isSelected,
  onToggle,
  rowIdKey = "id",
}: DataCardProps) {
  const titleCol = columns.find((c) => c.cardRole === "title");
  const subtitleCol = columns.find((c) => c.cardRole === "subtitle");
  const badgeCols = columns.filter((c) => c.cardRole === "badge");
  const fieldCols = columns.filter(
    (c) => !c.cardRole || c.cardRole === "field",
  );

  const renderCell = (col: Column) =>
    col.render ? col.render(row, refetch) : (row[col.key] ?? "—");

  return (
    <div
      className={[
        styles.dataCard,
        view === "list" ? styles.dataCardList : styles.dataCardGrid,
        selectable && isSelected ? styles.dataCardSelected : "",
        selectable ? styles.dataCardSelectable : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => selectable && onToggle?.()}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={
        selectable ? (e) => e.key === "Enter" && onToggle?.() : undefined
      }
    >
      {/* ── Card Header ── */}
      <div className={styles.dataCardHeader}>
        <div className={styles.dataCardHeaderLeft}>
          {selectable && (
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={!!isSelected}
              onChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Pilih baris ${row[rowIdKey]}`}
            />
          )}
          <div className={styles.dataCardTitles}>
            {titleCol && (
              <span className={styles.dataCardTitle}>
                {titleCol.render
                  ? titleCol.render(row, refetch)
                  : String(row[titleCol.key] ?? "—")}
              </span>
            )}
            {subtitleCol && (
              <span className={styles.dataCardSubtitle}>
                {subtitleCol.render
                  ? subtitleCol.render(row, refetch)
                  : String(row[subtitleCol.key] ?? "—")}
              </span>
            )}
          </div>
        </div>

        {/* Kanan header: badge + info button */}
        <div className={styles.dataCardHeaderRight}>
          {badgeCols.length > 0 && (
            <div className={styles.dataCardBadges}>
              {badgeCols.map((col) => (
                <span key={col.key} className={styles.dataCardBadgeItem}>
                  {col.render
                    ? col.render(row, refetch)
                    : String(row[col.key] ?? "—")}
                </span>
              ))}
            </div>
          )}
          <CardHeaderPopover
            titleCol={titleCol}
            subtitleCol={subtitleCol}
            badgeCols={badgeCols}
            row={row}
            refetch={refetch}
          />
        </div>
      </div>

      {/* ── Card Fields ── */}
      {fieldCols.length > 0 && (
        <div
          className={[
            styles.dataCardFields,
            view === "list"
              ? styles.dataCardFieldsList
              : styles.dataCardFieldsGrid,
          ].join(" ")}
        >
          {fieldCols.map((col) => (
            <div key={col.key} className={styles.dataCardField}>
              <span className={styles.dataCardFieldLabel}>{col.label}</span>
              <span className={styles.dataCardFieldValue}>
                {renderCell(col)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== VIEW TOGGLE BUTTON GROUP ==========
interface ViewToggleProps {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

function ViewToggle({ view, onChange }: ViewToggleProps) {
  const options: { value: ViewMode; icon: ReactNode; label: string }[] = [
    { value: "table", icon: <Table2 size={14} />, label: "Tabel" },
    { value: "grid", icon: <LayoutGrid size={14} />, label: "Grid" },
    { value: "list", icon: <LayoutList size={14} />, label: "List" },
  ];
  return (
    <div className={styles.viewToggle} role="group" aria-label="Pilih tampilan">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={[
            styles.viewToggleBtn,
            view === opt.value ? styles.viewToggleBtnActive : "",
          ].join(" ")}
          onClick={() => onChange(opt.value)}
          title={opt.label}
          aria-pressed={view === opt.value}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}

// ========== KOMPONEN UTAMA ==========
const Table = forwardRef<any, TableProps>((props, ref) => {
  const {
    url,
    columns = [],
    dataKey = "",
    pageSize = 10,
    exportName = "export",
    title,
    searchable = true,
    selectable = false,
    defaultParams = {},
    serverSide = true,
    rowIdKey = "id",
    serverSideFiltering = false,
    filterDebounceMs = 300,
    defaultView = "table",
    allowViewToggle = true,
    tableId,
  } = props;

  // ========== VIEW MODE ==========
  const isMobile = useIsMobile(768);

  // FIX: selector langsung ke nilai primitif di store — reactive, trigger re-render saat berubah
  const storedViewMode = useTablePrefsStore((s) =>
    tableId ? (s.prefs[tableId]?.viewMode ?? null) : null,
  );
  const storeSetViewMode = useTablePrefsStore((s) => s.setViewMode);

  // Fallback local state kalau tidak ada tableId
  const [localView, setLocalView] = useState<ViewMode | null>(null);

  // Priority: persisted store → local → mobile default → prop default
  const view: ViewMode =
    storedViewMode !== null
      ? storedViewMode
      : localView !== null
        ? localView
        : isMobile
          ? "list"
          : defaultView;

  const handleViewChange = useCallback(
    (v: ViewMode) => {
      if (tableId) {
        storeSetViewMode(tableId, v);
      } else {
        setLocalView(v);
      }
    },
    [tableId, storeSetViewMode],
  );

  // Auto-switch ke list saat pertama kali masuk di mobile (hanya kalau belum ada stored pref)
  useEffect(() => {
    if (isMobile && tableId && storedViewMode === null) {
      storeSetViewMode(tableId, "list");
    }
  }, [isMobile, tableId, storedViewMode, storeSetViewMode]);

  // ========== REFS ==========
  const tableScrollRef = useRef<HTMLDivElement>(null);

  // ========== MANUAL HIDDEN (kolom tabel) ==========

  // FIX: selector langsung ke array di store — reactive
  const storedHiddenCols = useTablePrefsStore(
    useShallow((s) => (tableId ? (s.prefs[tableId]?.hiddenColumns ?? []) : [])),
  );

  const storeSetHiddenCols = useTablePrefsStore((s) => s.setHiddenColumns);

  // FIX: useMemo (bukan useState) — selalu sync dengan store tanpa perlu useEffect tambahan
  // Kalau ada tableId: derived dari store. Kalau tidak: derived dari localHidden.
  const [localHidden, setLocalHidden] = useState<string[]>([]);
  const manualHidden = useMemo(
    () => new Set<string>(tableId ? storedHiddenCols : localHidden),
    [tableId, storedHiddenCols, localHidden],
  );

  const [showColPanel, setShowColPanel] = useState(false);

  // FIX: setter tidak pakai setManualHiddenLocal — langsung write ke store atau localHidden
  const toggleColVisibility = useCallback(
    (key: string) => {
      if (tableId) {
        // Baca state terkini dari store via getState() — tidak tergantung closure stale
        const current =
          useTablePrefsStore.getState().prefs[tableId]?.hiddenColumns ?? [];
        const currentSet = new Set(current);
        if (currentSet.has(key)) {
          currentSet.delete(key);
        } else {
          currentSet.add(key);
        }
        storeSetHiddenCols(tableId, [...currentSet]);
      } else {
        setLocalHidden((prev) => {
          const s = new Set(prev);
          if (s.has(key)) {
            s.delete(key);
          } else {
            s.add(key);
          }
          return [...s];
        });
      }
    },
    [tableId, storeSetHiddenCols],
  );

  const autoHidden = useOverflowCollapse(tableScrollRef, columns, manualHidden);

  const effectiveHidden = useMemo<Set<string>>(() => {
    const result = new Set<string>();
    autoHidden.forEach((key) => {
      if (!manualHidden.has(key)) result.add(key);
    });
    manualHidden.forEach((key) => {
      if (!autoHidden.has(key)) result.add(key);
    });
    return result;
  }, [autoHidden, manualHidden]);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !effectiveHidden.has(c.key)),
    [columns, effectiveHidden],
  );
  const hiddenColumns = useMemo(
    () => columns.filter((c) => effectiveHidden.has(c.key)),
    [columns, effectiveHidden],
  );
  const hasCollapsibleCols = columns.some((c) => c.collapsible);
  const hiddenCount = effectiveHidden.size;

  // ========== EXPANDED ROWS (table view only) ==========
  const [expandedRows, setExpandedRows] = useState<Set<any>>(new Set());
  const toggleExpandRow = useCallback((rowId: any) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);
  useEffect(() => {
    setExpandedRows(new Set());
  }, [effectiveHidden]);

  // ========== COLUMN FILTERS ==========
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );
  const [immediateFilters, setImmediateFilters] = useState<
    Record<string, string>
  >({});
  const debouncedFilters = useDebounce(immediateFilters, filterDebounceMs);
  useEffect(() => {
    setColumnFilters(debouncedFilters);
  }, [debouncedFilters]);

  // ========== USE TABLE DATA ==========
  const {
    data: hookData,
    allData,
    loading,
    error,
    refetch,
    fetchAll,
    search,
    setSearch,
    sortKey,
    sortDir,
    handleSort,
    page,
    setPage,
    totalRows: serverTotalRows,
    totalPages: serverTotalPages,
    selected,
    toggleRow,
    toggleAll,
    isSelected,
    isAllSelected,
    isIndeterminate,
  } = useTableData(url, {
    pageSize,
    dataKey,
    defaultParams,
    serverSide,
    filters: serverSideFiltering ? columnFilters : {},
  });

  const fallbackId = useId();

  useEffect(() => {
    if (serverSide) setPage(1);
  }, [columnFilters, serverSide, setPage]);

  const clearColumnFilters = useCallback(() => {
    setImmediateFilters({});
    setColumnFilters({});
    if (serverSide) setPage(1);
  }, [serverSide, setPage]);

  const clearAllFilters = useCallback(() => {
    clearColumnFilters();
    setSearch("");
  }, [clearColumnFilters, setSearch]);

  const activeFilterCount = useMemo(() => {
    let count = Object.values(columnFilters).filter(
      (v) => v && v.trim() !== "",
    ).length;
    if (search.trim()) count++;
    return count;
  }, [columnFilters, search]);

  // ========== FILTER & SORT CLIENT-SIDE ==========
  const shouldFilterClientSide = !serverSide || !serverSideFiltering;

  const filteredData = useMemo(() => {
    if (!shouldFilterClientSide) return [...allData];
    let result = [...allData];
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return (
            value != null && String(value).toLowerCase().includes(lowerSearch)
          );
        }),
      );
    }
    Object.entries(columnFilters).forEach(([colKey, filterValue]) => {
      if (!filterValue || filterValue.trim() === "") return;
      const lowerFilter = filterValue.toLowerCase();
      result = result.filter((row) => {
        const cellValue = row[colKey];
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(lowerFilter);
      });
    });
    return result;
  }, [allData, search, columnFilters, columns, shouldFilterClientSide]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      let aVal = col?.exportValue ? col.exportValue(a) : a[sortKey];
      let bVal = col?.exportValue ? col.exportValue(b) : b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortKey, sortDir, columns]);

  // ========== PAGINATION ==========
  const clientTotalRows = sortedData.length;
  const clientTotalPages = Math.ceil(clientTotalRows / pageSize);
  const effectiveTotalRows = serverSide ? serverTotalRows : clientTotalRows;
  const effectiveTotalPages = serverSide ? serverTotalPages : clientTotalPages;

  const paginatedData = useMemo(() => {
    if (serverSide) return hookData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [serverSide, hookData, sortedData, page, pageSize]);

  // ========== EXPORT ==========
  const exportCols = useMemo(
    () => columns.filter((c) => c.exportable !== false),
    [columns],
  );
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(
    async (format: "xlsx" | "pdf" = "xlsx") => {
      if (exporting) return;
      setExporting(true);
      try {
        let exportData: any[] = [];
        if (url && serverSide) {
          exportData = await fetchAll();
        } else {
          exportData = sortedData;
        }
        if (exportData.length === 0) return;
        const rows = exportData.map((row) =>
          Object.fromEntries(
            exportCols.map((col) => {
              const val = col.exportValue
                ? (col.exportValue(row) ?? "")
                : (row[col.key] ?? "");
              return [col.label, val];
            }),
          ),
        );
        if (format === "xlsx") {
          const ws = utils.json_to_sheet(rows);
          ws["!cols"] = exportCols.map((col) => ({
            wch: Math.min(
              Math.max(
                col.label.length,
                ...exportData.map((row) => String(row[col.key] ?? "").length),
              ) + 2,
              50,
            ),
          }));
          const wb = utils.book_new();
          utils.book_append_sheet(wb, ws, "Data");
          writeFile(wb, `${exportName}.xlsx`);
        } else {
          exportToPdf(rows, exportCols, exportName);
        }
      } catch (err: any) {
        console.error("Export gagal:", err);
        alert(`Export gagal: ${err?.message ?? "Terjadi kesalahan"}`);
      } finally {
        setExporting(false);
      }
    },
    [exporting, url, serverSide, fetchAll, sortedData, exportCols, exportName],
  );

  // ========== SORT ICON ==========
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey)
      return <ChevronsUpDown size={12} className={styles.sortIcon} />;
    return sortDir === "asc" ? (
      <ChevronUp
        size={12}
        className={`${styles.sortIcon} ${styles.sortIconActive}`}
      />
    ) : (
      <ChevronDown
        size={12}
        className={`${styles.sortIcon} ${styles.sortIconActive}`}
      />
    );
  };

  // ========== PAGE NUMBERS ==========
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (!effectiveTotalPages || effectiveTotalPages <= 1) return pages;
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(effectiveTotalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("...");
    }
    pages.push(...range);
    if (range[range.length - 1] < effectiveTotalPages) {
      if (range[range.length - 1] < effectiveTotalPages - 1) pages.push("...");
      pages.push(effectiveTotalPages);
    }
    return pages;
  }, [page, effectiveTotalPages]);

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setPage((p) =>
      effectiveTotalPages ? Math.min(effectiveTotalPages, p + 1) : p,
    );

  useImperativeHandle(ref, () => ({
    refetch,
    data: paginatedData,
    loading,
    clearAllFilters,
    setSearch,
  }));

  const handleFilterChange = (colKey: string, value: string) => {
    setImmediateFilters((prev) => ({ ...prev, [colKey]: value }));
  };

  const totalVisibleCols =
    visibleColumns.length +
    (selectable ? 1 : 0) +
    (hiddenColumns.length > 0 ? 1 : 0);

  // Kolom card view — exclude cardRole:'hidden'
  const cardColumns = useMemo(
    () => columns.filter((c) => c.cardRole !== "hidden"),
    [columns],
  );

  // ========== RENDER ==========
  return (
    <Card variant="outlined">
      <Card.Header
        title={title}
        action={
          <div className={styles.toolbarRight}>
            {searchable && (
              <div className={styles.search}>
                <span className={styles.searchIcon}>
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                title="Hapus semua filter"
                className={styles.clearAllFiltersBtn}
              >
                <XCircle size={14} /> Reset filter ({activeFilterCount})
              </Button>
            )}

            {/* View toggle */}
            {allowViewToggle && (
              <ViewToggle view={view} onChange={handleViewChange} />
            )}

            {/* Kolom toggle — hanya di table view */}
            {view === "table" && hasCollapsibleCols && (
              <div className={styles.colToggleWrapper}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColPanel((v) => !v)}
                  title="Atur kolom"
                  className={`${styles.colToggleBtn} ${hiddenCount > 0 ? styles.colToggleBtnActive : ""}`}
                >
                  <Columns3 size={14} />
                  {hiddenCount > 0 && (
                    <span className={styles.colToggleBadge}>{hiddenCount}</span>
                  )}
                </Button>
                {showColPanel && (
                  <ColVisibilityPanel
                    columns={columns}
                    manualHidden={manualHidden}
                    autoHidden={autoHidden}
                    effectiveHidden={effectiveHidden}
                    onToggle={toggleColVisibility}
                    onClose={() => setShowColPanel(false)}
                  />
                )}
              </div>
            )}

            <div className={styles.exportGroup}>
              <Button
                className={styles.exportBtn}
                onClick={() => handleExport("xlsx")}
                disabled={filteredData.length === 0 || exporting}
                title="Export ke Excel"
              >
                <FileSpreadsheet size={14} />
                {exporting ? "..." : "XLS"}
              </Button>
              <Button
                className={styles.exportBtn}
                onClick={() => handleExport("pdf")}
                disabled={filteredData.length === 0 || exporting}
                title="Export ke PDF"
              >
                <FileText size={14} />
                {exporting ? "..." : "PDF"}
              </Button>
            </div>
          </div>
        }
      />

      {error && (
        <div
          style={{
            padding: "var(--space-4)",
            color: "var(--color-danger)",
            fontSize: "var(--text-sm)",
          }}
        >
          Gagal memuat data: {error}.{" "}
          <Button
            onClick={refetch}
            variant="outline"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginLeft: "var(--space-1)",
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          CARD VIEW (grid / list)
          ══════════════════════════════════════════ */}
      {(view === "grid" || view === "list") && (
        <div className={styles.cardViewWrapper}>
          {/* Skeleton */}
          {loading && (
            <div
              className={view === "grid" ? styles.cardGrid : styles.cardList}
            >
              {Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`card-skel-${i}`}
                  className={`${styles.dataCard} ${view === "list" ? styles.dataCardList : styles.dataCardGrid} ${styles.dataCardSkeleton}`}
                >
                  <div className={styles.dataCardHeader}>
                    <div className={styles.dataCardTitles}>
                      <div
                        className={`${styles.skeleton} ${styles.skeletonTitle}`}
                      />
                      <div
                        className={`${styles.skeleton} ${styles.skeletonSubtitle}`}
                      />
                    </div>
                  </div>
                  <div className={styles.dataCardFields}>
                    {[1, 2, 3].map((j) => (
                      <div key={j} className={styles.dataCardField}>
                        <div
                          className={`${styles.skeleton} ${styles.skeletonLabel}`}
                        />
                        <div
                          className={`${styles.skeleton} ${styles.skeletonValue}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && paginatedData.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Inbox size={40} />
              </div>
              <p className={styles.emptyText}>
                {activeFilterCount > 0
                  ? "Tidak ada data yang sesuai dengan filter"
                  : search
                    ? `Tidak ada hasil untuk "${search}"`
                    : "Belum ada data"}
              </p>
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className={styles.clearFilterBtn}
                >
                  <XCircle size={14} /> Hapus semua filter
                </Button>
              )}
            </div>
          )}

          {/* Cards */}
          {!loading && !error && paginatedData.length > 0 && (
            <div
              className={view === "grid" ? styles.cardGrid : styles.cardList}
            >
              {paginatedData.map((row, index) => {
                const rowId = row[rowIdKey];
                return (
                  <DataCard
                    key={rowId ?? `${fallbackId}-${index}`}
                    row={row}
                    columns={cardColumns}
                    refetch={refetch}
                    view={view}
                    selectable={selectable}
                    isSelected={selectable ? isSelected(rowId) : false}
                    onToggle={() => selectable && toggleRow(rowId)}
                    rowIdKey={rowIdKey}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          TABLE VIEW
          ══════════════════════════════════════════ */}
      {view === "table" && (
        <div className={styles.tableScroll} ref={tableScrollRef}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {selectable && (
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleAll}
                      aria-label="Pilih semua"
                    />
                  </th>
                )}
                {hiddenColumns.length > 0 && (
                  <th className={styles.expandCell} aria-label="Detail" />
                )}
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    data-colkey={col.key}
                    className={`${styles.th} ${col.sortable ? styles.thSortable : ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                    aria-sort={
                      sortKey === col.key
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    <span className={styles.thInner}>
                      {col.label}
                      {col.sortable && <SortIcon colKey={col.key} />}
                      {col.filterable && columnFilters[col.key] && (
                        <span className={styles.filterActiveIcon}>
                          <Filter size={10} />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>

              {visibleColumns.some((col) => col.filterable) && (
                <tr className={styles.filterRow}>
                  {selectable && <td className={styles.filterCell} />}
                  {hiddenColumns.length > 0 && (
                    <td className={styles.filterCell} />
                  )}
                  {visibleColumns.map((col) => (
                    <td key={`filter-${col.key}`} className={styles.filterCell}>
                      {col.filterable && (
                        <div className={styles.filterInputWrapper}>
                          {col.filterType === "select" ? (
                            <select
                              value={immediateFilters[col.key] || ""}
                              onChange={(e) =>
                                handleFilterChange(col.key, e.target.value)
                              }
                              className={styles.filterSelect}
                            >
                              <option value="">Semua</option>
                              {col.filterOptions?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              placeholder={
                                col.filterPlaceholder || `Filter ${col.label}`
                              }
                              value={immediateFilters[col.key] || ""}
                              onChange={(e) =>
                                handleFilterChange(col.key, e.target.value)
                              }
                              className={styles.filterInput}
                            />
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className={styles.tr}>
                    {selectable && (
                      <td className={styles.checkboxCell}>
                        <div
                          className={styles.skeleton}
                          style={{ width: 16, height: 16 }}
                        />
                      </td>
                    )}
                    {hiddenColumns.length > 0 && (
                      <td className={styles.expandCell} />
                    )}
                    {visibleColumns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        <div
                          className={styles.skeleton}
                          style={{ width: `${60 + Math.random() * 30}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && !error && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={totalVisibleCols}>
                    <div className={styles.empty}>
                      <div className={styles.emptyIcon}>
                        <Inbox size={40} />
                      </div>
                      <p className={styles.emptyText}>
                        {activeFilterCount > 0
                          ? "Tidak ada data yang sesuai dengan filter"
                          : search
                            ? `Tidak ada hasil untuk "${search}"`
                            : "Belum ada data"}
                      </p>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          className={styles.clearFilterBtn}
                        >
                          <XCircle size={14} /> Hapus semua filter
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedData.map((row, index) => {
                  const rowId = row[rowIdKey];
                  const isExpanded = expandedRows.has(rowId ?? index);
                  const hasHiddenData = hiddenColumns.length > 0;
                  return (
                    <Fragment key={rowId ?? `${fallbackId}-${index}`}>
                      <tr
                        key={rowId ?? `${fallbackId}-${index}`}
                        className={`${styles.tr} ${selectable && isSelected(rowId) ? styles.trSelected : ""} ${isExpanded ? styles.trExpanded : ""}`}
                        onClick={() => selectable && toggleRow(rowId)}
                      >
                        {selectable && (
                          <td className={styles.checkboxCell}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={isSelected(rowId)}
                              onChange={() => toggleRow(rowId)}
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Pilih baris ${rowId}`}
                              disabled={rowId === undefined}
                            />
                          </td>
                        )}
                        {hasHiddenData && (
                          <td className={styles.expandCell}>
                            <button
                              className={`${styles.expandBtn} ${isExpanded ? styles.expandBtnOpen : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandRow(rowId ?? index);
                              }}
                              aria-label={
                                isExpanded ? "Tutup detail" : "Lihat detail"
                              }
                              aria-expanded={isExpanded}
                            >
                              <ChevronRight size={14} />
                            </button>
                          </td>
                        )}
                        {visibleColumns.map((col) => (
                          <td key={col.key} className={styles.td}>
                            {col.render
                              ? col.render(row, refetch)
                              : (row[col.key] ?? "—")}
                          </td>
                        ))}
                      </tr>
                      {hasHiddenData && isExpanded && (
                        <tr
                          key={`expand-${rowId ?? index}`}
                          className={styles.expandDetailRow}
                        >
                          <td
                            colSpan={totalVisibleCols}
                            className={styles.expandDetailCell}
                          >
                            <div className={styles.expandDetail}>
                              {hiddenColumns.map((col) => (
                                <div
                                  key={col.key}
                                  className={styles.expandDetailItem}
                                >
                                  <span className={styles.expandDetailLabel}>
                                    {col.label}
                                  </span>
                                  <span className={styles.expandDetailValue}>
                                    {col.render
                                      ? col.render(row, refetch)
                                      : (row[col.key] ?? "—")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footer ── */}
      {!loading && !error && effectiveTotalRows !== undefined && (
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {selectable &&
              selected.length > 0 &&
              `${selected.length} dipilih · `}
            {effectiveTotalRows} data
            {view === "table" && hiddenCount > 0 && (
              <span className={styles.footerHiddenInfo}>
                · {hiddenCount} kolom disembunyikan
              </span>
            )}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className={styles.clearFilterFooter}
              >
                <XCircle size={12} /> Reset semua filter ({activeFilterCount})
              </Button>
            )}
          </span>
          {effectiveTotalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                className={styles.pageBtn}
                onClick={goToPrevPage}
                disabled={page === 1}
              >
                ‹
              </Button>
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className={styles.footerInfo}
                    style={{ padding: "0 4px" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                ),
              )}
              <Button
                className={styles.pageBtn}
                onClick={goToNextPage}
                disabled={page === effectiveTotalPages}
              >
                ›
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

Table.displayName = "Table";
export default Table;
