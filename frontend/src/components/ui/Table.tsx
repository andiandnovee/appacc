// Table.tsx
import { forwardRef, useImperativeHandle, ReactNode, useMemo, useId, useState, useEffect, useCallback, useRef } from "react";
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
  // Properti untuk filter
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
  /** Jika true, filter per kolom akan dikirim ke server (hanya efektif jika serverSide=true) */
  serverSideFiltering?: boolean;
  /** Jeda debounce untuk filter text (ms) */
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
    totalPages: hookTotalPages,
    totalRows: hookTotalRows,
    selected,
    toggleRow,
    toggleAll,
    isSelected,
    isAllSelected,
    isIndeterminate,
  } = useTableData(url, { pageSize, dataKey, defaultParams, serverSide });

  const fallbackId = useId();
  useImperativeHandle(ref, () => ({
    refetch,
    data: paginatedData,
    loading,
    clearAllFilters,
  }));

  // ========== STATE FILTER PER KOLOM ==========
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  // Gunakan debounce untuk nilai filter text (agar tidak terlalu sering re-render)
  const [immediateFilters, setImmediateFilters] = useState<Record<string, string>>({});
  const debouncedFilters = useDebounce(immediateFilters, filterDebounceMs);

  // Sinkronkan debouncedFilters ke columnFilters sebenarnya
  useEffect(() => {
    setColumnFilters(debouncedFilters);
  }, [debouncedFilters]);

  const handleFilterChange = (colKey: string, value: string) => {
    // Update immediate state (tanpa debounce) agar UI responsif
    setImmediateFilters((prev) => ({ ...prev, [colKey]: value }));
    // Reset halaman ke 1 saat filter berubah (akan di-trigger setelah debounce)
  };

  // Reset halaman ketika columnFilters benar-benar berubah (setelah debounce)
  useEffect(() => {
    if (Object.keys(columnFilters).length > 0 || columnFilters !== immediateFilters) {
      setPage(1);
    }
  }, [columnFilters, setPage]);

  // Fungsi untuk menghapus semua filter kolom
  const clearColumnFilters = useCallback(() => {
    setImmediateFilters({});
    setColumnFilters({});
    setPage(1);
  }, [setPage]);

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

  // Reset pilihan (selected) saat filter berubah (opsional)
  useEffect(() => {
    if (selectable && activeFilterCount > 0) {
      // Jika ingin reset semua pilihan saat filter berubah, aktifkan baris di bawah
      // Namun hati-hati karena ini akan membatalkan pilihan pengguna
      // toggleAll(false);
    }
  }, [columnFilters, search, selectable, activeFilterCount]);

  // Peringatan jika serverSide=true dan tidak menggunakan serverSideFiltering
  useEffect(() => {
    if (serverSide && !serverSideFiltering && activeFilterCount > 0) {
      console.warn(
        "Filter pada serverSide=true hanya akan memfilter data yang sudah di-cache. Untuk filter lengkap, set serverSide=false atau aktifkan serverSideFiltering dan implementasikan parameter filter di API."
      );
    }
  }, [serverSide, serverSideFiltering, activeFilterCount]);

  // ========== FILTER DATA (CLIENT-SIDE) ==========
  // Hanya dilakukan jika serverSide=false ATAU serverSideFiltering=false (filter client-side)
  const shouldFilterClientSide = !serverSide || !serverSideFiltering;

  const filteredData = useMemo(() => {
    if (!shouldFilterClientSide) {
      // Jika server-side filtering aktif, kita tidak filter di client, anggap allData sudah sesuai
      return [...allData];
    }

    let result = [...allData];

    // Filter berdasarkan search global
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value != null && String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Filter per kolom (case-insensitive contains)
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

  // ========== SORTING (MANUAL) ==========
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

      // Konversi ke number jika memungkinkan
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

  // ========== PAGINATION (MANUAL) ==========
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalFilteredRows = filteredData.length;
  const totalFilteredPages = Math.ceil(totalFilteredRows / pageSize);

  // ========== EKSPOR (menggunakan filteredData) ==========
  const handleExport = () => {
    if (serverSide && allData.length < hookTotalRows && !serverSideFiltering) {
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

  // ========== PAGINATION NUMBERS ==========
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (!totalFilteredPages || totalFilteredPages <= 1) return pages;

    const delta = 1;
    const range: number[] = [];

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalFilteredPages, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("...");
    }

    pages.push(...range);

    if (range[range.length - 1] < totalFilteredPages) {
      if (range[range.length - 1] < totalFilteredPages - 1) pages.push("...");
      pages.push(totalFilteredPages);
    }

    return pages;
  }, [page, totalFilteredPages]);

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setPage((p) => (totalFilteredPages ? Math.min(totalFilteredPages, p + 1) : p));

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

      {/* ERROR STATE */}
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
              color: "var(--text-link)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
              padding: 0,
              marginLeft: "var(--space-1)",
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {/* Baris header kolom */}
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

            {/* Baris filter per kolom - hanya ditampilkan jika ada kolom yang filterable */}
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
            {/* SKELETON LOADING */}
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

            {/* EMPTY STATE */}
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

            {/* DATA ROWS */}
            {!loading &&
              paginatedData.map((row, index) => {
                const rowId = row[rowIdKey];
                if (rowId === undefined && selectable) {
                  console.warn(`Row missing key "${rowIdKey}" for selection`);
                }
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
                        {col.render
                          ? col.render(row, refetch)
                          : (row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* FOOTER & PAGINATION */}
      {!loading && !error && totalFilteredRows !== undefined && (
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {selectable && selected.length > 0 && `${selected.length} dipilih · `}
            {totalFilteredRows} data
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
          {totalFilteredPages > 1 && (
            <div className={styles.pagination}>
              <Button
                className={styles.pageBtn}
                onClick={goToPrevPage}
                disabled={page === 1}
                aria-label="Halaman sebelumnya"
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
                    aria-current={page === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}
              
              <Button
                className={styles.pageBtn}
                onClick={goToNextPage}
                disabled={page === totalFilteredPages}
                aria-label="Halaman berikutnya"
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