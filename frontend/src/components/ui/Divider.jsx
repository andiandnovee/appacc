import styles from './Divider.module.css'

/**
 * Divider
 * - orientation → 'horizontal' | 'vertical' (default: 'horizontal')
 * - label       → teks di tengah garis (opsional)
 */
export default function Divider({ orientation = 'horizontal', label }) {
  return (
    <div
      className={`${styles.divider} ${styles[orientation]}`}
      role="separator"
      aria-orientation={orientation}
    >
      <span className={styles.line} />
      {label && <span className={styles.label}>{label}</span>}
      {label && <span className={styles.line} />}
    </div>
  )
}
