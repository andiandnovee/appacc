import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import styles from './Toast.module.css'

/* ── Icon per variant ──────────────────────────────────────── */
const VARIANT_CONFIG = {
  success: { icon: CheckCircle   },
  warning: { icon: AlertTriangle },
  danger:  { icon: XCircle       },
  info:    { icon: Info          },
}

/* ════════════════════════════════════════════════════════════
   Context
   ════════════════════════════════════════════════════════════ */
const ToastContext = createContext(null)

/* ════════════════════════════════════════════════════════════
   ToastItem — satu toast
   ════════════════════════════════════════════════════════════ */
function ToastItem({ id, variant = 'info', title, description, duration = 4000, onRemove }) {
  const [leaving, setLeaving]       = useState(false)
  const [progress, setProgress]     = useState(100)
  const intervalRef                 = useRef(null)
  const { icon: Icon }              = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.info

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(id), 300) // tunggu animasi keluar selesai
  }, [id, onRemove])

  // ── Auto dismiss + progress bar ────────────────────────
  useEffect(() => {
    if (!duration) return

    const step     = 100 / (duration / 50)  // update tiap 50ms
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(intervalRef.current)
          dismiss()
          return 0
        }
        return prev - step
      })
    }, 50)

    return () => clearInterval(intervalRef.current)
  }, [duration, dismiss])

  return (
    <div className={`${styles.toast} ${styles[variant]} ${leaving ? styles.toastLeave : ''}`}>

      {/* Icon */}
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>

      {/* Content */}
      <div className={styles.content}>
        {title       && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Dismiss button */}
      <button
        className={styles.dismiss}
        onClick={dismiss}
        aria-label="Tutup notifikasi"
      >
        <X size={15} />
      </button>

      {/* Progress bar */}
      {duration && (
        <div
          className={styles.progress}
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      )}

    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ToastProvider — taruh di root App
   ════════════════════════════════════════════════════════════ */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ variant = 'info', title, description, duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts(prev => [...prev, { id, variant, title, description, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {createPortal(
        <div className={styles.container} aria-live="polite" aria-atomic="false">
          {toasts.map(toast => (
            <ToastItem
              key={toast.id}
              {...toast}
              onRemove={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ════════════════════════════════════════════════════════════
   useToast — hook untuk trigger toast dari mana saja
   ════════════════════════════════════════════════════════════ */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}
