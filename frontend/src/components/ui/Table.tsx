// Table.tsx
import {
  forwardRef,
  useImperativeHandle,
  ReactNode,
  useMemo,
  useId,
  useState,
  useEffect,
  useCallback,
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
} from "lucide-react";
import { useTableData } from "./useTableData";
import Card from "./Card";
import Button from "./Button";
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

// ========== EXPORT PDF ==========
function exportToPdf(
  rows: Record<string, any>[],
  cols: { key: string; label: string }[],
  exportName: string
) {
  const colLabels = cols.map((c) => c.label);

  const tableRows = rows
    .map(
      (row) =>
        `<tr>${colLabels.map((label) => `<td>${row[label] ?? ""}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>${exportName}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          color: #111;
          padding: 24px;
        }
        h2 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
        table { border-collapse: collapse; width: 100%; }
        thead tr { background: #f3f4f6; }
        th {
          border: 1px solid #d1d5db;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          white-space: nowrap;
        }
        td {
          border: 1px solid #e5e7eb;
          padding: 5px 10px;
          font-size: 11px;
          color: #374151;
          vertical-align: middle;
        }
        tr:nth-child(even) td { background: #f9fafb; }
        .meta { margin-top: 16px; font-size: 10px; color: #9ca3af; }
        @media print {
          body { padding: 12px; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <h2>${exportName}</h2>
      <table>
        <thead>
          <tr>${colLabels.map((l) => `<th>${l}</th>`).join("")}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <p class="meta">
        Diekspor pada: ${new Date().toLocaleString("id-ID")} · Total: ${rows.length} data
      </p>
      <script>
        window.onload = function () {
          setTimeout(function () {
            window.print();
            window.onafterprint = function () { window.close(); };
          }, 300);
        };
      <\/script>
    </body>
    </html>
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
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any, refetch?: () => void) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: Array<{ value: string; label: string }>;
  filterPlaceholder?: string;
  exportable?: boolean; // set false untuk skip kolom ini saat export (misal kolom Aksi)
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
}

// ========== KOMPONEN ==========
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
  } = props;

  // ========== STATE FILTER KOLOM ==========
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [immediateFilters, setImmediateFilters] = useState<Record<string, string>>({});
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

  // Reset page saat filter kolom berubah
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
    let count = Object.values(columnFilters).filter((v) => v && v.trim() !== "").length;
    if (search.trim()) count++;
    return count;
  }, [columnFilters, search]);

  useEffect(() => {
    if (serverSide && !serverSideFiltering && activeFilterCount > 0) {
      console.warn(
        "Filter pada serverSide=true hanya memfilter data cache. Untuk filter lengkap, set serverSide=false atau aktifkan serverSideFiltering."
      );
    }
  }, [serverSide, serverSideFiltering, activeFilterCount]);

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
          return value != null && String(value).toLowerCase().includes(lowerSearch);
        })
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
      let aVal = a[sortKey];
      let bVal = b[sortKey];
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
  }, [filteredData, sortKey, sortDir]);

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
  // Kolom yang di-export: semua kecuali yang exportable=false
  const exportCols = useMemo(
    () => columns.filter((c) => c.exportable !== false),
    [columns]
  );

  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(
    async (format: "xlsx" | "pdf" = "xlsx") => {
      if (exporting) return;
      setExporting(true);

      try {
        let exportData: any[] = [];

        if (url && serverSide) {
          // Fetch semua data dari server dengan filter aktif (per_page=9999)
          exportData = await fetchAll();
        } else {
          // Client-side: pakai data yang sudah difilter & diurutkan
          exportData = sortedData;
        }

        if (exportData.length === 0) return;

        // Build rows: gunakan raw value (bukan render) untuk setiap kolom
        const rows = exportData.map((row) =>
          Object.fromEntries(
            exportCols.map((col) => [col.label, row[col.key] ?? ""])
          )
        );

        if (format === "xlsx") {
          const ws = utils.json_to_sheet(rows);

          // Auto column width
          ws["!cols"] = exportCols.map((col) => ({
            wch: Math.min(
              Math.max(
                col.label.length,
                ...exportData.map((row) => String(row[col.key] ?? "").length)
              ) + 2,
              50
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
    [exporting, url, serverSide, fetchAll, sortedData, exportCols, exportName]
  );

  // ========== SORT ICON ==========
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey)
      return <ChevronsUpDown size={12} className={styles.sortIcon} />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className={`${styles.sortIcon} ${styles.sortIconActive}`} />
    ) : (
      <ChevronDown size={12} className={`${styles.sortIcon} ${styles.sortIconActive}`} />
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
    setPage((p) => (effectiveTotalPages ? Math.min(effectiveTotalPages, p + 1) : p));

  useImperativeHandle(ref, () => ({
    refetch,
    data: paginatedData,
    loading,
    clearAllFilters,
  }));

  const handleFilterChange = (colKey: string, value: string) => {
    setImmediateFilters((prev) => ({ ...prev, [colKey]: value }));
  };

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
                <XCircle size={14} />
                Reset filter ({activeFilterCount})
              </Button>
            )}

            {/* Export buttons */}
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

      <div className={styles.tableScroll}>
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
              {columns.map((col) => (
                <th
                  key={col.key}
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

            {columns.some((col) => col.filterable) && (
              <tr className={styles.filterRow}>
                {selectable && <td className={styles.filterCell} />}
                {columns.map((col) => (
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
                            placeholder={col.filterPlaceholder || `Filter ${col.label}`}
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
                      <div className={styles.skeleton} style={{ width: 16, height: 16 }} />
                    </td>
                  )}
                  {columns.map((col) => (
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
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
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
                return (
                  <tr
                    key={rowId ?? `${fallbackId}-${index}`}
                    className={`${styles.tr} ${
                      selectable && isSelected(rowId) ? styles.trSelected : ""
                    }`}
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
                    {columns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        {col.render ? col.render(row, refetch) : (row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {!loading && !error && effectiveTotalRows !== undefined && (
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {selectable && selected.length > 0 && `${selected.length} dipilih · `}
            {effectiveTotalRows} data
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
                    className={`${styles.pageBtn} ${
                      page === p ? styles.pageBtnActive : ""
                    }`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
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