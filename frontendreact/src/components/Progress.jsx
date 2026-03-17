import styles from './Progress.module.css'

const RING_COLORS = {
  primary: 'var(--color-primary-500)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
}

/**
 * ProgressBar
 * - value    → 0–100
 * - label    → string (opsional)
 * - showValue → tampilkan persentase (default: true)
 * - size     → 'sm'|'md'|'lg' (default: 'md')
 * - variant  → 'primary'|'success'|'warning'|'danger' (default: 'primary')
 * - striped  → boolean animated stripes (default: false)
 */
export function ProgressBar({
  value = 0,
  label,
  showValue = true,
  size = 'md',
  variant = 'primary',
  striped = false,
}) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={`${styles.barWrapper} ${styles[variant]}`}>
      {(label || showValue) && (
        <div className={styles.barHeader}>
          {label     && <span className={styles.barLabel}>{label}</span>}
          {showValue && <span className={styles.barValue}>{pct}%</span>}
        </div>
      )}
      <div
        className={`${styles.track} ${styles[`track${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${styles.fill} ${striped ? styles.striped : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * ProgressRing
 * - value    → 0–100
 * - size     → px ukuran lingkaran (default: 80)
 * - stroke   → tebal garis (default: 8)
 * - variant  → 'primary'|'success'|'warning'|'danger' (default: 'primary')
 * - label    → teks di bawah angka (opsional)
 * - showValue → tampilkan persentase (default: true)
 */
export function ProgressRing({
  value = 0,
  size = 80,
  stroke = 8,
  variant = 'primary',
  label,
  showValue = true,
}) {
  const pct    = Math.min(100, Math.max(0, value))
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color  = RING_COLORS[variant] ?? RING_COLORS.primary
  const fs     = size < 60 ? 'var(--text-xs)' : size < 100 ? 'var(--text-sm)' : 'var(--text-base)'

  return (
    <div className={styles.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--bg-surface-2)"
          strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: `stroke-dashoffset var(--duration-slow) var(--ease-default)` }}
        />
      </svg>
      <div className={styles.ringLabel}>
        {showValue && <span className={styles.ringValue} style={{ fontSize: fs }}>{pct}%</span>}
        {label     && <span className={styles.ringCaption}>{label}</span>}
      </div>
    </div>
  )
}
