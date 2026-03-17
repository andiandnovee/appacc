import { Check, X } from 'lucide-react'
import styles from './Stepper.module.css'

/**
 * Stepper
 *
 * Props:
 * - steps       → array of { label, sublabel?, content? }
 * - current     → index step aktif (0-based)
 * - orientation → 'horizontal' | 'vertical' (default: 'horizontal')
 *
 * Status step otomatis:
 * - index < current  → done
 * - index === current → active
 * - index > current  → upcoming
 *
 * Contoh:
 * steps={[
 *   { label: 'Data Diri',   sublabel: 'Isi informasi' },
 *   { label: 'Verifikasi',  sublabel: 'Cek email'     },
 *   { label: 'Selesai',     sublabel: 'Akun aktif'    },
 * ]}
 */
export default function Stepper({ steps = [], current = 0, orientation = 'horizontal' }) {
  const isVertical = orientation === 'vertical'

  return (
    <div className={`${styles.stepper} ${isVertical ? styles.vertical : ''}`}>
      {steps.map((step, i) => {
        const isDone   = i < current
        const isActive = i === current

        const circleClass = [
          styles.circle,
          isDone   ? styles.circleDone   : '',
          isActive ? styles.circleActive : '',
        ].filter(Boolean).join(' ')

        const labelClass = [
          styles.label,
          isDone   ? styles.labelDone   : '',
          isActive ? styles.labelActive : '',
        ].filter(Boolean).join(' ')

        return (
          <div key={i} className={styles.step}>

            <div className={styles.stepHead}>

              {/* Circle */}
              <div
                className={circleClass}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>

              {/* Label */}
              <div className={styles.labelGroup}>
                <span className={labelClass}>{step.label}</span>
                {step.sublabel && (
                  <span className={styles.sublabel}>{step.sublabel}</span>
                )}
              </div>

              {/* Vertical content */}
              {isVertical && isActive && step.content && (
                <div className={styles.stepContent}>{step.content}</div>
              )}

            </div>

            {/* Connector — tidak tampil di step terakhir */}
            {i < steps.length - 1 && (
              <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} aria-hidden="true" />
            )}

          </div>
        )
      })}
    </div>
  )
}
