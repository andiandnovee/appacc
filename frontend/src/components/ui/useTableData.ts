// hooks/useTableData.js
import { useState, useEffect, useCallback, useMemo } from 'react'
import api from "../../api/axios";

export function useTableData(url, {
  pageSize = 10,
  dataKey = '',
  defaultParams = {},
  serverSide = true,
  filters = {},
} = {}) {

  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalRows, setTotalRows] = useState(0)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [refetchCount, setRefetchCount] = useState(0)

  const queryString = useMemo(() => {
    if (!serverSide) return ''

    const params = new URLSearchParams()

    Object.entries(defaultParams).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params.append(key, String(value))
      }
    })

    params.append('per_page', String(pageSize))
    params.append('page', String(page))

    if (search) params.append('search', search)

    if (sortKey) {
      params.append('sort_by', sortKey)
      params.append('sort_dir', sortDir)
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params.append(`filter[${key}]`, String(value))
      }
    })

    return params.toString()
  }, [defaultParams, pageSize, page, search, sortKey, sortDir, serverSide, filters])

  // ========== FETCH DATA HALAMAN ==========
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(url, {
          params: serverSide
            ? Object.fromEntries(new URLSearchParams(queryString))
            : undefined,
        })

        const json = response.data

        if (serverSide) {
          const data = dataKey ? json[dataKey] : json.data
          setRawData(Array.isArray(data) ? data : [])
          setTotalRows(json.meta?.total || json.total || data?.length || 0)
        } else {
          const data = dataKey ? json[dataKey] : json
          if (!Array.isArray(data)) throw new Error("Response bukan array")
          setRawData(data)
          setTotalRows(data.length)
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Terjadi kesalahan"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, queryString, serverSide, dataKey, refetchCount])

  // Reset page saat search, sort, atau filters berubah
  useEffect(() => {
    if (serverSide) setPage(1)
  }, [search, sortKey, sortDir, filters, serverSide])

  // ========== FETCH ALL (untuk export) ==========
  // Kirim semua filter/search/sort yang aktif, tapi per_page=9999
  const fetchAll = useCallback(async (maxRows = 5000) => {
    try {
      const params = {}

      // Default params
      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value != null && value !== '') params[key] = String(value)
      })

      // per_page besar, page 1
       params.per_page = maxRows 
      params.page = 1

      // Search
      if (search) params.search = search

      // Sort
      if (sortKey) {
        params.sort_by = sortKey
        params.sort_dir = sortDir
      }

      // Column filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          params[`filter[${key}]`] = String(value)
        }
      })

      const response = await api.get(url, { params })
      const json = response.data

      if (serverSide) {
        const data = dataKey ? json[dataKey] : json.data
        return Array.isArray(data) ? data : []
      } else {
        const data = dataKey ? json[dataKey] : json
        return Array.isArray(data) ? data : []
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Terjadi kesalahan"
      throw new Error(message)
    }
  }, [url, defaultParams, search, sortKey, sortDir, filters, serverSide, dataKey])

  // ========== CLIENT-SIDE FILTER & SORT ==========
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

  const clientTotalRows = sorted.length
  const clientTotalPages = Math.max(1, Math.ceil(clientTotalRows / pageSize))

  const paginated = useMemo(() => {
    if (serverSide) return sorted
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize, serverSide])

  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey])

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

  const isSelected = useCallback((id) => selected.includes(id), [selected])
  const isAllSelected = paginated.length > 0 && paginated.every(r => selected.includes(r.id))
  const isIndeterminate = !isAllSelected && paginated.some(r => selected.includes(r.id))

  return {
    data: paginated,
    allData: serverSide ? rawData : sorted,
    loading,
    error,
    refetch: () => setRefetchCount(c => c + 1),
    fetchAll,                                          // ← expose untuk export
    totalRows: serverSide ? totalRows : clientTotalRows,
    totalPages: serverSide ? Math.ceil(totalRows / pageSize) : clientTotalPages,
    search, setSearch,
    sortKey, sortDir, handleSort,
    page, setPage, pageSize,
    selected, toggleRow, toggleAll,
    isSelected, isAllSelected, isIndeterminate,
    clearSelection: () => setSelected([]),
  }
}