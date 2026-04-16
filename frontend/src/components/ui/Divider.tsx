import { FC, ReactNode, ReactElement } from 'react'
import styles from './Divider.module.css'

interface DividerProps {
  orientation?: any
  label?: any
}


/**
 * Divider
 * - orientation → 'horizontal' | 'vertical' (default: 'horizontal')
 * - label       → teks di tengah garis (opsional)
 */
const Divider: FC<DividerProps> = ({  orientation = 'horizontal', label  }) => {
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
