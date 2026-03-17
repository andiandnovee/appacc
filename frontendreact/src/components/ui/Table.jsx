import { utils, writeFile } from 'xlsx'
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, Inbox } from 'lucide-react'
import { useTableData } from './useTableData'
import Card from './Card'
import styles from './Table.module.css'

/* ════════════════════════════════════════════════════════════
   Table
   ════════════════════════════════════════════════════════════

   Props:
   - url          → string  — endpoint API (wajib)
   - columns      → array   — definisi kolom (wajib), lihat contoh di bawah
   - dataKey      → string  — key response yang berisi data (default: '')
   - pageSize     → number  — baris per halaman (default: 10)
   - exportName   → string  — nama file Excel saat export (default: 'export')
   - title        → string  — judul tabel (opsional)
   - searchable   → boolean — tampilkan search bar (default: true)
   - selectable   → boolean — tampilkan checkbox (default: false)

   Contoh columns:
   [
     { key: 'id',    label: 'ID',    sortable: true  },
     { key: 'name',  label: 'Nama',  sortable: true  },
     { key: 'email', label: 'Email', sortable: false },
     {
       key: 'status',
       label: 'Status',
       sortable: false,
       render: (row) => <Badge variant={row.status === 'aktif' ? 'success' : 'danger'}>{row.status}</Badge>
     },
   ]
*/
export default function Table({
  url,
  columns = [],
  dataKey = '',
  pageSize = 10,
  exportName = 'export',
  title,
  searchable = true,
  selectable = false,
}) {
  const {
    data, allData, loading, error, refetch,
    search, setSearch,
    sortKey, sortDir, handleSort,
    page, setPage, totalPages, totalRows,
    selected, toggleRow, toggleAll,
    isSelected, isAllSelected, isIndeterminate,
  } = useTableData(url, { pageSize, dataKey })

  // ── Export Excel ────────────────────────────────────────
  const handleExport = () => {
    const exportCols = columns.filter(c => !c.render)  // skip kolom custom render
    const rows = allData.map(row =>
      Object.fromEntries(exportCols.map(c => [c.label, row[c.key] ?? '']))
    )
    const ws = utils.json_to_sheet(rows)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFile(wb, `${exportName}.xlsx`)
  }

  // ── Sort icon ────────────────────────────────────────────
  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={12} className={styles.sortIcon} />
    return sortDir === 'asc'
      ? <ChevronUp   size={12} className={`${styles.sortIcon} ${styles.sortIconActive}`} />
      : <ChevronDown size={12} className={`${styles.sortIcon} ${styles.sortIconActive}`} />
  }

  // ── Pagination pages ─────────────────────────────────────
  const pageNumbers = () => {
    const pages = []
    const delta = 1  // tampilkan N halaman di kiri/kanan current page
    const range = []

    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i)
    }

    if (range[0] > 1) {
      pages.push(1)
      if (range[0] > 2) pages.push('...')
    }

    pages.push(...range)

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Card variant="outlined">
      <div className={styles.wrapper}>

        {/* ── Toolbar ─────────────────────────────────── */}
        <Card.Header
          title={title}
          action={
            <div className={styles.toolbarRight}>
              {/* Search */}
              {searchable && (
                <div className={styles.search}>
                  <span className={styles.searchIcon}><Search size={14} /></span>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Cari..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              )}

              {/* Export */}
              <button className={styles.exportBtn} onClick={handleExport} title="Export ke Excel">
                <Download size={14} />
                Export
              </button>
            </div>
          }
        />

        {/* ── Error state ─────────────────────────────── */}
        {error && (
          <div style={{ padding: 'var(--space-4)', color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>
            Gagal memuat data: {error}.{' '}
            <button onClick={refetch} style={{ color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Table ───────────────────────────────────── */}
        <div className={styles.tableScroll}>
          <table className={styles.table}>

            {/* Head */}
            <thead className={styles.thead}>
              <tr>
                {selectable && (
                  <th className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isAllSelected}
                      ref={el => { if (el) el.indeterminate = isIndeterminate }}
                      onChange={toggleAll}
                      aria-label="Pilih semua"
                    />
                  </th>
                )}
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={`${styles.th} ${col.sortable ? styles.thSortable : ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                    aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className={styles.thInner}>
                      {col.label}
                      {col.sortable && <SortIcon colKey={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {/* Loading skeleton */}
              {loading && Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className={styles.tr}>
                  {selectable && <td className={styles.checkboxCell}><div className={styles.skeleton} style={{ width: 16, height: 16 }} /></td>}
                  {columns.map(col => (
                    <td key={col.key} className={styles.td}>
                      <div className={styles.skeleton} style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Empty state */}
              {!loading && !error && data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)}>
                    <div className={styles.empty}>
                      <div className={styles.emptyIcon}><Inbox size={40} /></div>
                      <p className={styles.emptyText}>
                        {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading && data.map(row => (
                <tr
                  key={row.id}
                  className={`${styles.tr} ${isSelected(row.id) ? styles.trSelected : ''}`}
                  onClick={() => selectable && toggleRow(row.id)}
                >
                  {selectable && (
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected(row.id)}
                        onChange={() => toggleRow(row.id)}
                        onClick={e => e.stopPropagation()}
                        aria-label={`Pilih baris ${row.id}`}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className={styles.td}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* ── Footer: info + pagination ────────────────── */}
        {!loading && !error && (
          <div className={styles.footer}>
            <span className={styles.footerInfo}>
              {selected.length > 0
                ? `${selected.length} dipilih · `
                : ''
              }
              {totalRows} data
            </span>

            <div className={styles.pagination}>
              {/* Prev */}
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Halaman sebelumnya"
              >
                ‹
              </button>

              {/* Page numbers */}
              {pageNumbers().map((p, i) =>
                p === '...'
                  ? <span key={`dots-${i}`} className={styles.footerInfo} style={{ padding: '0 4px' }}>…</span>
                  : <button
                      key={p}
                      className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                      onClick={() => setPage(p)}
                      aria-current={page === p ? 'page' : undefined}
                    >
                      {p}
                    </button>
              )}

              {/* Next */}
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Halaman berikutnya"
              >
                ›
              </button>
            </div>
          </div>
        )}

      </div>
    </Card>
  )
}
