import { FC, ReactNode, ReactElement, useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import styles from './MultiSelect.module.css'

interface MultiSelectProps {
  value?: any
  onChange?: any
  options?: any
  label?: any
  placeholder?: any
  hint?: any
  error?: any
  required?: any
  disabled?: any
  maxItems?: any
}


/**
 * MultiSelect — Tag input with dropdown
 *
 * Props:
 * - value      → array of selected values (wajib)
 * - onChange   → (values: array) => void (wajib)
 * - options    → array of { value, label } atau string[]
 * - label      → string
 * - placeholder → string
 * - hint, error, required, disabled
 * - maxItems   → max pilihan (opsional)
 */
const MultiSelect: FC<MultiSelectProps> = ({ 
  value = [],
  onChange,
  options = [],
  label,
  placeholder = 'Pilih atau ketik...',
  hint,
  error,
  required = false,
  disabled = false,
  maxItems,
 }) => {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef          = useRef(null)
  const inputRef            = useRef(null)

  // Normalisasi options
  const normalized = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  // Filter berdasarkan search
  const filtered = normalized.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) &&
    !value.includes(o.value)
  )

  // Tutup saat klik luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (val) => {
    if (maxItems && value.length >= maxItems) return
    onChange([...value, val])
    setSearch('')
    inputRef.current?.focus()
  }

  const remove = (val) => onChange(value.filter(v => v !== val))

  const handleKeyDown = (e) => {
    // Backspace hapus tag terakhir
    if (e.key === 'Backspace' && !search && value.length) {
      remove(value[value.length - 1])
    }
    // Escape tutup
    if (e.key === 'Escape') { setOpen(false); setSearch('') }
  }

  const getLabel = (val) => normalized.find(o => o.value === val)?.label ?? val

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* Label */}
      {label && (
        <label
          className={`${styles.label} ${required ? styles.labelRequired : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
      )}

      <div className={styles.dropdownRelative}>

        {/* Control */}
        <div
          className={[
            styles.control,
            open  ? styles.controlOpen  : '',
            error ? styles.controlError : '',
          ].filter(Boolean).join(' ')}
          onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus() } }}
        >
          {/* Tags */}
          {value.map(val => (
            <span key={val} className={styles.tag}>
              {getLabel(val)}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={(e) => { e.stopPropagation(); remove(val) }}
                aria-label={`Hapus ${getLabel(val)}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}

          {/* Input */}
          {(!maxItems || value.length < maxItems) && (
            <input
              ref={inputRef}
              className={styles.input}
              placeholder={value.length === 0 ? placeholder : ''}
              value={search}
              onChange={e => { setSearch(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              aria-autocomplete="list"
              aria-expanded={open}
            />
          )}
        </div>

        {/* Dropdown */}
        {open && !disabled && (
          <div className={styles.dropdown} role="listbox">
            {filtered.length === 0 ? (
              <div className={styles.optionEmpty}>
                {search ? `Tidak ada hasil untuk "${search}"` : 'Semua sudah dipilih'}
              </div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  className={`${styles.option} ${value.includes(opt.value) ? styles.optionSelected : ''}`}
                  role="option"
                  aria-selected={value.includes(opt.value)}
                  onMouseDown={(e) => { e.preventDefault(); select(opt.value) }}
                >
                  {opt.label}
                  {value.includes(opt.value) && <Check size={14} />}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      {error && <p className={`${styles.message} ${styles.messageError}`} role="alert">{error}</p>}
      {!error && hint && <p className={`${styles.message} ${styles.messageHint}`}>{hint}</p>}

    </div>
  )
}
