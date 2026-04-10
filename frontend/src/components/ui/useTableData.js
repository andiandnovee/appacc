import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * useTableData
 *
 * Hook untuk mengelola state table: fetch, sort, search, pagination.
 *
 * @param {string}  url         - endpoint API (wajib) - bisa full URL atau relative
 * @param {object}  options
 * @param {number}  options.pageSize     - jumlah baris per halaman (default: 10)
 * @param {string}  options.dataKey      - key dari response yang berisi array data
 * @param {object}  options.defaultParams - parameter default seperti trash_filter
 * @param {boolean} options.serverSide   - true jika search/sort/pagination di backend (default: true)
 */
export function useTableData(url, { 
  pageSize = 10, 
  dataKey = '', 
  defaultParams = {},
  serverSide = true 
} = {}) {

  const [rawData,   setRawData]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [totalRows, setTotalRows] = useState(0)

  const [search,    setSearch]    = useState('')
  const [sortKey,   setSortKey]   = useState('')
  const [sortDir,   setSortDir]   = useState('asc')
  const [page,      setPage]      = useState(1)
  const [selected,  setSelected]  = useState([])

  // ── Build query string ──────────────────────────────────────────
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()
    
    // Default params (misal: trash_filter)
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    // Pagination
    params.append('per_page', pageSize)
    params.append('page', page)
    
    // Search
    if (search) params.append('search', search)
    
    // Sort
    if (sortKey) {
      params.append('sort_by', sortKey)
      params.append('sort_dir', sortDir)
    }
    
    return params.toString()
  }, [defaultParams, pageSize, page, search, sortKey, sortDir])

  // ── Fetch data (server-side) ────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let finalUrl = url
      
      if (serverSide) {
        const queryString = buildQueryString()
        finalUrl = queryString ? `${url}?${queryString}` : url
      }
      
      const res = await fetch(finalUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Ambil token dari localStorage/sessionStorage
          'Authorization': `Bearer ${localStorage.getItem('appacc_token') || sessionStorage.getItem('appacc_token')}`,
        },
        credentials: 'include',
      })

      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const json = await res.json()
      
      if (serverSide) {
        // Server-side: response berbentuk { data: [...], meta: { total, ... } }
        const data = dataKey ? json[dataKey] : json.data
        setRawData(Array.isArray(data) ? data : [])
        setTotalRows(json.meta?.total || json.total || data?.length || 0)
      } else {
        // Client-side: response langsung array
        const data = dataKey ? json[dataKey] : json
        if (!Array.isArray(data)) throw new Error('Response bukan array')
        setRawData(data)
        setTotalRows(data.length)
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url, serverSide, buildQueryString, dataKey])

  // ── Initial fetch & refetch ─────────────────────────────────────
  useEffect(() => { 
    fetchData() 
  }, [fetchData])

  // ── Reset page saat search/sort berubah ─────────────────────────
  useEffect(() => { 
    if (serverSide) setPage(1) 
  }, [search, sortKey, sortDir, serverSide])

  // ── Client-side filtering (jika serverSide = false) ─────────────
  const filtered = useMemo(() => {
    if (serverSide) return rawData
    
    if (!search.trim()) return rawData
    const q = search.toLowerCase()
    return rawData.filter(row =>
      Object.values(row).some(val =>
        String(val ?? '').toLowerCase().includes(q)
      )
    )
  }, [rawData, search, serverSide])

  // ── Client-side sorting (jika serverSide = false) ───────────────
  const sorted = useMemo(() => {
    if (serverSide) return filtered
    
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir, serverSide])

  // ── Client-side pagination (jika serverSide = false) ────────────
  const clientTotalRows = sorted.length
  const clientTotalPages = Math.max(1, Math.ceil(clientTotalRows / pageSize))
  
  useEffect(() => { 
    if (!serverSide) setPage(1) 
  }, [search, serverSide])

  const paginated = useMemo(() => {
    if (serverSide) return sorted
    
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize, serverSide])

  // ── Sort handler ────────────────────────────────────────────────
  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey])

  // ── Select rows ─────────────────────────────────────────────────
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
    allData:  serverSide ? rawData : sorted,
    loading,
    error,
    refetch:  fetchData,
    totalRows: serverSide ? totalRows : clientTotalRows,
    totalPages: serverSide ? Math.ceil(totalRows / pageSize) : clientTotalPages,

    // search
    search, setSearch,

    // sort
    sortKey, sortDir, handleSort,

    // pagination
    page, setPage, pageSize,

    // selection
    selected, toggleRow, toggleAll,
    isSelected, isAllSelected, isIndeterminate,
    clearSelection: () => setSelected([]),
  }
}