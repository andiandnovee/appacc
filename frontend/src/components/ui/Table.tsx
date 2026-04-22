// Table.tsx
import { forwardRef, useImperativeHandle, ReactNode, useMemo, useId, useState, useEffect, useCallback } from "react";
import { utils, writeFile } from "xlsx";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  XCircle,
  Filter,
} from "lucide-react";
import { useTableData } from "./useTableData";
import Card from "./Card";
import Button from "./Button";
import styles from "./Table.module.css";

// ========== HOOK DEBOUNCE ==========
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any, refetch?: () => void) => ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: Array<{ value: string; label: string }>;
  filterPlaceholder?: string;
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

  // ========== STATE FILTER PER KOLOM (harus sebelum useTableData) ==========
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [immediateFilters, setImmediateFilters] = useState<Record<string, string>>({});
  const debouncedFilters = useDebounce(immediateFilters, filterDebounceMs);

  // Sinkronkan debouncedFilters ke columnFilters
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

  // Reset halaman ketika columnFilters berubah (setelah debounce)
  useEffect(() => {
    if (serverSide) {
      setPage(1);
    }
  }, [columnFilters, serverSide, setPage]);

  // Fungsi untuk menghapus semua filter kolom
  const clearColumnFilters = useCallback(() => {
    setImmediateFilters({});
    setColumnFilters({});
    if (serverSide) setPage(1);
  }, [serverSide, setPage]);

  // Fungsi untuk menghapus semua filter (termasuk search global)
  const clearAllFilters = useCallback(() => {
    clearColumnFilters();
    setSearch("");
  }, [clearColumnFilters, setSearch]);

  // Hitung jumlah filter aktif (kolom + search)
  const activeFilterCount = useMemo(() => {
    let count = Object.values(columnFilters).filter(v => v && v.trim() !== "").length;
    if (search.trim()) count++;
    return count;
  }, [columnFilters, search]);

  // Peringatan jika serverSide=true dan tidak menggunakan serverSideFiltering
  useEffect(() => {
    if (serverSide && !serverSideFiltering && activeFilterCount > 0) {
      console.warn(
        "Filter pada serverSide=true hanya akan memfilter data yang sudah di-cache. Untuk filter lengkap, set serverSide=false atau aktifkan serverSideFiltering dan implementasikan parameter filter di API."
      );
    }
  }, [serverSide, serverSideFiltering, activeFilterCount]);

  // ========== FILTER & SORTING CLIENT-SIDE (hanya jika serverSide=false atau serverSideFiltering=false) ==========
  const shouldFilterClientSide = !serverSide || !serverSideFiltering;

  const filteredData = useMemo(() => {
    if (!shouldFilterClientSide) {
      // Server-side filtering aktif, data dari server sudah sesuai
      return [...allData];
    }

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
    const column = columns.find((c) => c.key === sortKey);
    if (!column) return sorted;

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
  }, [filteredData, sortKey, sortDir, columns]);

  // ========== PAGINATION ==========
  // Untuk client-side, kita hitung sendiri; untuk server-side, gunakan dari hook
  const clientTotalRows = sortedData.length;
  const clientTotalPages = Math.ceil(clientTotalRows / pageSize);

  const effectiveTotalRows = serverSide ? serverTotalRows : clientTotalRows;
  const effectiveTotalPages = serverSide ? serverTotalPages : clientTotalPages;

  // Data yang ditampilkan: jika server-side, gunakan hookData (sudah dipaginasi oleh server)
  // Jika client-side, lakukan paginasi manual
  const paginatedData = useMemo(() => {
    if (serverSide) {
      return hookData; // server sudah mengembalikan data per halaman
    } else {
      const start = (page - 1) * pageSize;
      return sortedData.slice(start, start + pageSize);
    }
  }, [serverSide, hookData, sortedData, page, pageSize]);

  // ========== EKSPOR ==========
  const handleExport = () => {
    if (serverSide && allData.length < serverTotalRows && !serverSideFiltering) {
      console.warn(
        "Export hanya berdasarkan data yang sudah dimuat. Untuk export lengkap, set serverSide=false atau aktifkan serverSideFiltering."
      );
    }

    const exportCols = columns.filter((c) => !c.render);
    const rows = filteredData.map((row) =>
      Object.fromEntries(exportCols.map((c) => [c.label, row[c.key] ?? ""]))
    );
    if (rows.length === 0) return;
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `${exportName}.xlsx`);
  };

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

  // ========== PAGINATION NUMBERS ==========
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (!effectiveTotalPages || effectiveTotalPages <= 1) return pages;

    const delta = 1;
    const range: number[] = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(effectiveTotalPages, page + delta); i++) {
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
  const goToNextPage = () => setPage((p) => (effectiveTotalPages ? Math.min(effectiveTotalPages, p + 1) : p));

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    refetch,
    data: paginatedData,
    loading,
    clearAllFilters,
  }));

  const handleFilterChange = (colKey: string, value: string) => {
    setImmediateFilters((prev) => ({ ...prev, [colKey]: value }));
  };

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
            <Button
              className={styles.exportBtn}
              onClick={handleExport}
              title="Export ke Excel"
              disabled={filteredData.length === 0}
            >
              <Download size={14} />
              Export
            </Button>
          </div>
        }
      />

      {error && (
        <div style={{ padding: "var(--space-4)", color: "var(--color-danger)", fontSize: "var(--text-sm)" }}>
          Gagal memuat data: {error}.{" "}
          <Button onClick={refetch} variant="outline" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, marginLeft: "var(--space-1)" }}>
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
                    ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
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
                  aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
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
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            className={styles.filterSelect}
                          >
                            <option value="">Semua</option>
                            {col.filterOptions?.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={col.filterPlaceholder || `Filter ${col.label}`}
                            value={immediateFilters[col.key] || ""}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
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
            {loading && Array.from({ length: pageSize }).map((_, i) => (
              <tr key={`skeleton-${i}`} className={styles.tr}>
                {selectable && <td className={styles.checkboxCell}><div className={styles.skeleton} style={{ width: 16, height: 16 }} /></td>}
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    <div className={styles.skeleton} style={{ width: `${60 + Math.random() * 30}%` }} />
                  </td>
                ))}
              </tr>
            ))}
            {!loading && !error && paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}><Inbox size={40} /></div>
                    <p className={styles.emptyText}>
                      {activeFilterCount > 0 ? "Tidak ada data yang sesuai dengan filter" : search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data"}
                    </p>
                    {activeFilterCount > 0 && (
                      <Button variant="outline" size="sm" onClick={clearAllFilters} className={styles.clearFilterBtn}>
                        <XCircle size={14} /> Hapus semua filter
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {!loading && paginatedData.map((row, index) => {
              const rowId = row[rowIdKey];
              return (
                <tr
                  key={rowId ?? `${fallbackId}-${index}`}
                  className={`${styles.tr} ${selectable && isSelected(rowId) ? styles.trSelected : ""}`}
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
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className={styles.clearFilterFooter}>
                <XCircle size={12} /> Reset semua filter ({activeFilterCount})
              </Button>
            )}
          </span>
          {effectiveTotalPages > 1 && (
            <div className={styles.pagination}>
              <Button className={styles.pageBtn} onClick={goToPrevPage} disabled={page === 1}>‹</Button>
              {pageNumbers.map((p, i) => p === "..." ? (
                <span key={`dots-${i}`} className={styles.footerInfo} style={{ padding: "0 4px" }}>…</span>
              ) : (
                <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`} onClick={() => setPage(p as number)}>
                  {p}
                </button>
              ))}
              <Button className={styles.pageBtn} onClick={goToNextPage} disabled={page === effectiveTotalPages}>›</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

Table.displayName = "Table";

export default Table;