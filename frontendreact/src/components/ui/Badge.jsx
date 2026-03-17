import styles from './Badge.module.css'

/**
 * Badge
 *
 * Props:
 * - variant     → 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
 *                 (default: 'default')
 * - size        → 'sm' | 'md' | 'lg' (default: 'md')
 * - pill        → boolean — border-radius full (default: false)
 * - dot         → boolean — tampilkan dot indicator di kiri (default: false)
 * - icon        → React node — icon di kiri teks
 * - dismissible → boolean — tampilkan tombol × di kanan (default: false)
 * - onDismiss   → function — callback saat tombol × diklik
 * - children    → teks / konten badge
 */

export default function Badge({
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  icon,
  dismissible = false,
  onDismiss,
  children,
}) {
  const badgeClass = [
    styles.badge,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClass}>

      {/* Dot indicator */}
      {dot && <span className={styles.dot} aria-hidden="true" />}

      {/* Icon kiri */}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}

      {/* Konten */}
      {children}

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Hapus"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 2l6 6M8 2L2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

    </span>
  )
}
