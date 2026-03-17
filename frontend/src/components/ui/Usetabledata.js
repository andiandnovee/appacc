import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * useTableData
 *
 * Hook untuk mengelola state table: fetch, sort, search, pagination.
 *
 * @param {string}  url         - endpoint API (wajib)
 * @param {object}  options
 * @param {number}  options.pageSize  - jumlah baris per halaman (default: 10)
 * @param {string}  options.dataKey   - key dari response yang berisi array data
 *                                      misal: response = { data: [...], total: 100 }
 *                                      → dataKey = 'data'
 *                                      Kalau response langsung array, biarkan kosong.
 */
export function useTableData(url, { pageSize = 10, dataKey = '' } = {}) {

  const [rawData,   setRawData]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  const [search,    setSearch]    = useState('')
  const [sortKey,   setSortKey]   = useState('')
  const [sortDir,   setSortDir]   = useState('asc')   // 'asc' | 'desc'
  const [page,      setPage]      = useState(1)
  const [selected,  setSelected]  = useState([])       // array of row id

  // ── Fetch data ──────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          // Kalau pakai Sanctum, token biasanya di cookie.
          // Kalau pakai Bearer token, tambahkan:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',  // untuk Sanctum cookie-based auth
      })

      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const json = await res.json()
      const data = dataKey ? json[dataKey] : json

      if (!Array.isArray(data)) throw new Error('Response bukan array')

      setRawData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url, dataKey])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Search (client-side) ────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return rawData
    const q = search.toLowerCase()
    return rawData.filter(row =>
      Object.values(row).some(val =>
        String(val ?? '').toLowerCase().includes(q)
      )
    )
  }, [rawData, search])

  // ── Sort ────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''

      // Angka
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }

      // String
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  // ── Pagination ──────────────────────────────────────────
  const totalRows  = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  // Reset ke page 1 saat search berubah
  useEffect(() => { setPage(1) }, [search])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  // ── Sort handler ────────────────────────────────────────
  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey])

  // ── Select rows ─────────────────────────────────────────
  const toggleRow = useCallback((id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const toggleAll = useCallback(() => {
    const pageIds = paginated.map(r => r.id)
    const allSelected = pageIds.every(id => selected.includes(id))
    if (allSelected) {
      setSelected(prev => prev.filter(id => !pageIds.includes(id)))
    } else {
      setSelected(prev => [...new Set([...prev, ...pageIds])])
    }
  }, [paginated, selected])

  const isSelected    = useCallback((id) => selected.includes(id), [selected])
  const isAllSelected = paginated.length > 0 &&
                        paginated.every(r => selected.includes(r.id))
  const isIndeterminate = !isAllSelected &&
                          paginated.some(r => selected.includes(r.id))

  return {
    // data
    data:     paginated,
    allData:  sorted,       // untuk export — data lengkap setelah filter/sort
    loading,
    error,
    refetch:  fetchData,

    // search
    search, setSearch,

    // sort
    sortKey, sortDir, handleSort,

    // pagination
    page, setPage, totalPages, totalRows, pageSize,

    // selection
    selected, toggleRow, toggleAll,
    isSelected, isAllSelected, isIndeterminate,
    clearSelection: () => setSelected([]),
  }
}
