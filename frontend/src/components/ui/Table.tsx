// Table.tsx
import { forwardRef, useImperativeHandle, ReactNode, useMemo } from "react";
import { utils, writeFile } from "xlsx";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
} from "lucide-react";
import { useTableData } from "./useTableData";
import Card from "./Card";
import Button from "./Button";
import styles from "./Table.module.css";

interface TableProps {
  url?: string;
  columns?: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: any, refetch?: () => void) => ReactNode;
  }>;
  dataKey?: string;
  pageSize?: number;
  exportName?: string;
  title?: string;
  searchable?: boolean;
  selectable?: boolean;
  defaultParams?: Record<string, any>;
  serverSide?: boolean;
  rowIdKey?: string; // tambahan: key untuk ID unik (default "id")
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
  } = props;

  const {
    data,
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
    totalPages,
    totalRows,
    selected,
    toggleRow,
    toggleAll,
    isSelected,
    isAllSelected,
    isIndeterminate,
  } = useTableData(url, { pageSize, dataKey, defaultParams, serverSide });

  useImperativeHandle(ref, () => ({
    refetch,
    data,
    loading,
  }));

  // ========== EXPORT ==========
  // Peringatan: export hanya bisa mengekspor seluruh data jika serverSide = false
  // Jika serverSide = true, export akan menggunakan data yang sudah di-cache (mungkin tidak lengkap)
  const handleExport = () => {
    if (serverSide && allData.length < totalRows) {
      console.warn(
        "Exporting only loaded data. For full export, set serverSide=false or implement server-side export."
      );
    }

    const exportCols = columns.filter((c) => !c.render);
    const rows = allData.map((row) =>
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

  // ========== PAGINATION ==========
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (!totalPages || totalPages <= 1) return pages;

    const delta = 1;
    const range: number[] = [];

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("...");
    }

    pages.push(...range);

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  const goToPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p));

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
            <Button
              className={styles.exportBtn}
              onClick={handleExport}
              title="Export ke Excel"
              disabled={allData.length === 0}
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
                  </span>
                </th>
              ))}
            </tr>
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
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                      <Inbox size={40} />
                    </div>
                    <p className={styles.emptyText}>
                      {search
                        ? `Tidak ada hasil untuk "${search}"`
                        : "Belum ada data"}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* DATA ROWS */}
            {!loading &&
              data.map((row) => {
                const rowId = row[rowIdKey];
                if (rowId === undefined && selectable) {
                  console.warn(`Row missing key "${rowIdKey}" for selection`);
                }
                return (
                  <tr
                    key={rowId ?? Math.random()}
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
      {!loading && !error && totalRows !== undefined && (
        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            {selectable && selected.length > 0 && `${selected.length} dipilih · `}
            {totalRows} data
          </span>
          {totalPages > 1 && (
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
                disabled={page === totalPages}
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