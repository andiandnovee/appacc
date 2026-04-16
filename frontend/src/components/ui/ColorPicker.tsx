import { FC, ReactNode, ReactElement, useState, useRef, useEffect } from 'react'
import styles from './ColorPicker.module.css'

interface ColorPickerProps {
  value?: any
  onChange?: any
  label?: any
  presets?: any
  disabled?: any
}


const PRESETS = [
  '#5470ef', '#07c3b3', '#16a34a', '#ca8a04',
  '#dc2626', '#9333ea', '#0ea5e9', '#f97316',
  '#64748b', '#1e293b', '#ffffff', '#000000',
]

const isValidHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v)

/**
 * ColorPicker
 *
 * Props:
 * - value      → hex string misal '#5470ef' (wajib)
 * - onChange   → (hex: string) => void (wajib)
 * - label      → string
 * - presets    → array hex strings (default: PRESETS di atas)
 * - disabled   → boolean
 */
const ColorPicker: FC<ColorPickerProps> = ({ 
  value,
  onChange,
  label,
  presets = PRESETS,
  disabled = false,
 }) => {
  const [open,     setOpen]     = useState(false)
  const [hexInput, setHexInput] = useState(value)
  const wrapperRef              = useRef(null)

  // Sync hexInput saat value berubah dari luar
  useEffect(() => { setHexInput(value) }, [value])

  // Tutup saat klik luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleHexInput = (e) => {
    const raw = e.target.value
    setHexInput(raw)
    // Hanya trigger onChange kalau valid
    const hex = raw.startsWith('#') ? raw : `#${raw}`
    if (isValidHex(hex)) onChange(hex)
  }

  const handleNative = (e) => {
    const hex = e.target.value
    onChange(hex)
    setHexInput(hex)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {label && <label className={styles.label}>{label}</label>}

      <div style={{ position: 'relative', display: 'inline-flex' }}>

        {/* Trigger */}
        <button
          type="button"
          className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
          onClick={() => !disabled && setOpen(v => !v)}
          disabled={disabled}
        >
          <span className={styles.swatch} style={{ backgroundColor: value }} />
          <span className={styles.hexValue}>{value?.toUpperCase()}</span>
        </button>

        {/* Panel */}
        {open && (
          <div className={styles.panel}>

            {/* Native color input (gradient picker) */}
            <input
              type="color"
              className={styles.nativeInput}
              value={value}
              onChange={handleNative}
            />

            {/* Preset swatches */}
            {presets.length > 0 && (
              <div>
                <p className={styles.presetsLabel}>Warna preset</p>
                <div className={styles.presets}>
                  {presets.map(hex => (
                    <button
                      key={hex}
                      type="button"
                      className={`${styles.presetSwatch} ${value === hex ? styles.presetSwatchActive : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => { onChange(hex); setHexInput(hex) }}
                      aria-label={hex}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hex input manual */}
            <div className={styles.hexRow}>
              <span className={styles.hexLabel}>HEX</span>
              <input
                type="text"
                className={styles.hexInput}
                value={hexInput}
                onChange={handleHexInput}
                maxLength={7}
                spellCheck={false}
                placeholder="#000000"
              />
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
