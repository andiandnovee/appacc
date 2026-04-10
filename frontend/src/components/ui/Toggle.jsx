import { useId } from 'react'
import styles from './Toggle.module.css'

/**
 * Toggle Switch Component
 * 
 * Props:
 * - value           → boolean (checked state)
 * - onChange        → function(e) where e.target.checked is boolean
 * - label           → label text
 * - description     → description text
 * - disabled        → boolean
 * - size            → 'sm' | 'md' | 'lg' (default: 'md')
 * - variant         → 'primary' | 'danger' | 'success' (default: 'primary')
 * - ...rest         → passed to input
 */
export default function Toggle({
  value,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'primary',
  ...rest
}) {
  const id = useId()

  const handleChange = (e) => {
    onChange(e)
  }

  const wrapperClass = [
    styles.wrapper,
    styles[size],
    disabled ? styles.disabled : '',
  ].filter(Boolean).join(' ')

  const toggleClass = [
    styles.toggle,
    styles[variant],
    value ? styles.toggled : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapperClass}>
      <div className={styles.control}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.input}
          {...rest}
        />
        <label htmlFor={id} className={toggleClass} aria-hidden="true">
          <span className={styles.thumb} />
        </label>
      </div>

      {(label || description) && (
        <div className={styles.content}>
          {label && (
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          )}
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
