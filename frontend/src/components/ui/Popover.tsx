import { FC, ReactNode, ReactElement, useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Popover.module.css'

interface PopoverProps {
  trigger?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showClose?: boolean;
  open?: boolean;              // properti terpisah
  controlledOpen?: boolean;    // properti terpisah
  onOpenChange?: (open: boolean) => void;
}


/**
 * Popover
 *
 * Props:
 * - trigger    → React node — elemen yang diklik untuk buka popover
 * - title      → string (opsional)
 * - children   → konten popover
 * - position   → 'top'|'bottom'|'left'|'right'|
 *                'topStart'|'topEnd'|'bottomStart'|'bottomEnd'
 *                (default: 'bottomStart')
 * - showClose  → boolean — tampilkan tombol × (default: true)
 * - open       → boolean (controlled, opsional)
 * - onOpenChange → (open) => void (controlled, opsional)
 */
const Popover: FC<PopoverProps> = ({ 
  trigger,
  title,
  children,
  position = 'bottomStart',
  showClose = true,
  open: controlledOpen,
  onOpenChange,
 }) => {
  const isControlled  = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open          = isControlled ? controlledOpen : internalOpen
  const wrapperRef    = useRef(null)

  const setOpen = (val) => {
    if (!isControlled) setInternalOpen(val)
    onOpenChange?.(val)
  }

  // Tutup saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>

      {/* Trigger */}
      <span onClick={() => setOpen(!open)} style={{ display: 'inline-flex' }}>
        {trigger}
      </span>

      {/* Popover panel */}
      {open && (
        <div
          className={`${styles.popover} ${styles[position]}`}
          role="dialog"
          aria-modal="false"
        >
          {(title || showClose) && (
            <div className={styles.header}>
              {title && <p className={styles.title}>{title}</p>}
              {showClose && (
                <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Tutup">
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          <div className={styles.body}>{children}</div>
        </div>
      )}

    </div>
  )
}
