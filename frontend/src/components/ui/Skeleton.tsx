import { FC, ReactNode, ReactElement } from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  variant?: any
  width?: any
  height?: any
  count?: any
  gap?: any
}


/**
 * Skeleton
 * - variant → 'text' | 'circle' | 'rect' (default: 'rect')
 * - width   → CSS width  (default: '100%')
 * - height  → CSS height (default: '1rem')
 * - count   → jumlah baris skeleton teks (default: 1)
 * - gap     → jarak antar baris (default: '0.5rem')
 */
const Skeleton: FC<SkeletonProps> = ({ 
  variant = 'rect',
  width   = '100%',
  height  = '1rem',
  count   = 1,
  gap     = '0.5rem',
 }) => {
  const cls = [
    styles.skeleton,
    variant === 'circle' ? styles.circle : '',
    variant === 'text'   ? styles.text   : '',
  ].filter(Boolean).join(' ')

  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cls}
            style={{
              width:  i === count - 1 ? '70%' : width,  // baris terakhir lebih pendek
              height,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <span
      className={cls}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
