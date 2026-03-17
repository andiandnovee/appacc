import styles from './Timeline.module.css'

const DOT_VARIANT = {
  primary: '',
  success: styles.dotSuccess,
  warning: styles.dotWarning,
  danger:  styles.dotDanger,
  neutral: styles.dotNeutral,
}

/**
 * Timeline
 *
 * Props:
 * - items → array of:
 *   {
 *     title:       string,
 *     description: string (opsional),
 *     time:        string (opsional),
 *     variant:     'primary'|'success'|'warning'|'danger'|'neutral',
 *     icon:        React node (opsional — ganti dot dengan icon),
 *     extra:       React node (opsional — konten tambahan di bawah deskripsi),
 *   }
 */
export default function Timeline({ items = [] }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>

          {/* Kiri: dot / icon + garis */}
          <div className={styles.aside}>
            {item.icon
              ? <div className={styles.dotIcon} aria-hidden="true">{item.icon}</div>
              : <div className={`${styles.dot} ${DOT_VARIANT[item.variant ?? 'primary']}`} aria-hidden="true" />
            }
            <div className={styles.line} aria-hidden="true" />
          </div>

          {/* Kanan: konten */}
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h4 className={styles.title}>{item.title}</h4>
              {item.time && <span className={styles.time}>{item.time}</span>}
            </div>
            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}
            {item.extra && (
              <div className={styles.extra}>{item.extra}</div>
            )}
          </div>

        </div>
      ))}
    </div>
  )
}
