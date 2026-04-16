import { FC, ReactNode, ReactElement, useId } from 'react'
import styles from './RangeSlider.module.css'

interface RangeSliderProps {
  value?: any
  onChange?: any
  min?: any
  max?: any
  step?: any
  label?: any
  showValue?: any
  formatValue?: any
  disabled?: any
}


/**
 * RangeSlider
 *
 * Props:
 * - value      → number (wajib)
 * - onChange   → (value: number) => void (wajib)
 * - min        → number (default: 0)
 * - max        → number (default: 100)
 * - step       → number (default: 1)
 * - label      → string
 * - showValue  → boolean (default: true)
 * - formatValue → (value) => string — format tampilan nilai
 * - disabled   → boolean
 */
const RangeSlider: FC<RangeSliderProps> = ({ 
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = v => v,
  disabled = false,
 }) => {
  const id  = useId()
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={styles.wrapper}>

      {/* Header */}
      {(label || showValue) && (
        <div className={styles.header}>
          {label     && <label htmlFor={id} className={styles.label}>{label}</label>}
          {showValue && <span className={styles.valueDisplay}>{formatValue(value)}</span>}
        </div>
      )}

      {/* Track */}
      <div className={styles.sliderTrack}>

        {/* Fill */}
        <div className={styles.sliderFill} style={{ width: `${pct}%` }} />

        {/* Native input (invisible, handles interaction) */}
        <input
          id={id}
          type="range"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />

        {/* Visual thumb */}
        <div className={styles.thumb} style={{ left: `${pct}%` }} aria-hidden="true" />
      </div>

      {/* Min-max labels */}
      <div className={styles.minMax}>
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>

    </div>
  )
}
