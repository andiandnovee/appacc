import { FC, ReactNode, ReactElement, useId } from 'react'
import { Check, Minus } from 'lucide-react'
import styles from './FormControls.module.css'

interface ComponentProps {
  checked?: any
  onChange?: any
  indeterminate?: any
  label?: any
  hint?: any
  disabled?: any
}


/* ════════════════════════════════════════════════════════════
   Checkbox
   ════════════════════════════════════════════════════════════
   Props:
   - checked        → boolean
   - onChange       → (e) => void
   - indeterminate  → boolean — state "-" (default: false)
   - label          → string
   - hint           → string
   - disabled       → boolean
*/
export function Checkbox({ checked, onChange, indeterminate = false, label, hint, disabled = false }) {
  const id = useId()

  const boxClass = [
    styles.checkbox,
    checked || indeterminate ? styles.checkboxChecked : '',
    indeterminate ? styles.checkboxIndeterminate : '',
  ].filter(Boolean).join(' ')

  return (
    <label
      htmlFor={id}
      className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        className={styles.hiddenInput}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ref={el => { if (el) el.indeterminate = indeterminate }}
      />
      <span className={boxClass} aria-hidden="true">
        {indeterminate
          ? <Minus size={10} className={styles.checkIcon} strokeWidth={3} />
          : checked
            ? <Check size={10} className={styles.checkIcon} strokeWidth={3} />
            : null
        }
      </span>
      {(label || hint) && (
        <span className={styles.labelGroup}>
          {label && <span className={styles.label}>{label}</span>}
          {hint  && <span className={styles.hint}>{hint}</span>}
        </span>
      )}
    </label>
  )
}

/* ════════════════════════════════════════════════════════════
   Radio
   ════════════════════════════════════════════════════════════
   Props:
   - checked   → boolean
   - onChange  → (e) => void
   - value     → string (wajib untuk radio group)
   - name      → string (wajib untuk radio group)
   - label     → string
   - hint      → string
   - disabled  → boolean
*/
export function Radio({ checked, onChange, value, name, label, hint, disabled = false }) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`}
    >
      <input
        id={id}
        type="radio"
        className={styles.hiddenInput}
        checked={checked}
        onChange={onChange}
        value={value}
        name={name}
        disabled={disabled}
      />
      <span className={`${styles.radio} ${checked ? styles.radioChecked : ''}`} aria-hidden="true">
        <span className={`${styles.radioDot} ${checked ? styles.radioDotVisible : ''}`} />
      </span>
      {(label || hint) && (
        <span className={styles.labelGroup}>
          {label && <span className={styles.label}>{label}</span>}
          {hint  && <span className={styles.hint}>{hint}</span>}
        </span>
      )}
    </label>
  )
}

/* ════════════════════════════════════════════════════════════
   Toggle / Switch
   ════════════════════════════════════════════════════════════
   Props:
   - checked   → boolean
   - onChange  → (e) => void
   - label     → string
   - hint      → string
   - disabled  → boolean
*/
export function Toggle({ checked, onChange, label, hint, disabled = false }) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={`${styles.wrapper} ${disabled ? styles.wrapperDisabled : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.hiddenInput}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-checked={checked}
      />
      <span className={`${styles.track} ${checked ? styles.trackOn : ''}`} aria-hidden="true">
        <span className={`${styles.thumb} ${checked ? styles.thumbOn : ''}`} />
      </span>
      {(label || hint) && (
        <span className={styles.labelGroup}>
          {label && <span className={styles.label}>{label}</span>}
          {hint  && <span className={styles.hint}>{hint}</span>}
        </span>
      )}
    </label>
  )
}

export default { Checkbox, Radio, Toggle }
