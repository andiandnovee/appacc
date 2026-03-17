import { useState } from 'react'
import styles from './Tooltip.module.css'

/**
 * Tooltip
 *
 * Props:
 * - content   → string — teks tooltip (wajib)
 * - position  → 'top'|'bottom'|'left'|'right' (default: 'top')
 * - children  → element yang di-wrap
 */
export default function Tooltip({ content, position = 'top', children }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <span
        role="tooltip"
        className={[
          styles.tip,
          styles[position],
          visible ? styles.tipVisible : '',
        ].filter(Boolean).join(' ')}
      >
        {content}
      </span>
    </span>
  )
}
