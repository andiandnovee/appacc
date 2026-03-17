import { useId } from 'react'
import styles from './Select.module.css'

/**
 * Select
 *
 * Props:
 * - value, onChange    → controlled select (wajib)
 * - options            → array of string ATAU array of object { value, label, disabled }
 * - label              → teks label di atas select
 * - placeholder        → teks option pertama yang tidak bisa dipilih (default: 'Pilih...')
 * - hint               → pesan bantuan di bawah
 * - error              → pesan error
 * - size               → 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled           → boolean
 * - required           → boolean
 * - ...rest            → props lain diteruskan ke <select>
 *
 * Contoh options:
 * - ['Aktif', 'Nonaktif']
 * - [{ value: 'admin', label: 'Administrator' }, { value: 'user', label: 'User' }]
 */

export default function Select({
  value,
  onChange,
  options = [],
  label,
  placeholder = 'Pilih...',
  hint,
  error,
  size = 'md',
  disabled = false,
  required = false,
  ...rest
}) {
  const id = useId()

  // Normalisasi options — support string atau object
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string'
      ? { value: opt, label: opt, disabled: false }
      : { value: opt.value, label: opt.label, disabled: opt.disabled ?? false }
  )

  const selectClass = [
    styles.select,
    styles[size],
    error ? styles.error : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${required ? styles.labelRequired : ''}`}
        >
          {label}
        </label>
      )}

      {/* Select container */}
      <div className={styles.container}>

        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Options */}
          {normalizedOptions.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron — mengganti panah default browser */}
        <span className={styles.chevron} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

      </div>

      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className={`${styles.message} ${styles.messageError}`} role="alert">
          {error}
        </p>
      )}

      {/* Hint message */}
      {!error && hint && (
        <p id={`${id}-hint`} className={`${styles.message} ${styles.messageHint}`}>
          {hint}
        </p>
      )}

    </div>
  )
}
