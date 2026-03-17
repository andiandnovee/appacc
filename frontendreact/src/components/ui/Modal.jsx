import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

/* ── Icon Close ────────────────────────────────────────────── */
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 3l10 10M13 3L3 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

/* ════════════════════════════════════════════════════════════
   Modal — komponen utama
   ════════════════════════════════════════════════════════════

   Props:
   - isOpen          → boolean — kontrol tampil/sembunyi (wajib)
   - onClose         → function — callback saat modal ditutup (wajib)
   - size            → 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
   - closeOnBackdrop → boolean — klik backdrop menutup modal (default: true)
   - children        → gunakan Modal.Header, Modal.Body, Modal.Footer
*/
function Modal({
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  children,
}) {
  // ── Lock scroll body saat modal terbuka ────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Tutup dengan tombol Escape ──────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  // ── Klik backdrop ───────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`${styles.panel} ${styles[size]}`}>
        {children}
      </div>
    </div>,
    document.body
  )
}

/* ════════════════════════════════════════════════════════════
   Modal.Header
   ════════════════════════════════════════════════════════════

   Props:
   - title      → string — judul modal
   - subtitle   → string — subjudul (opsional)
   - onClose    → function — diteruskan dari Modal (wajib jika pakai sub-komponen)
   - actions    → React node — tombol/komponen lain SEBELUM tombol close
   - children   → override konten header sepenuhnya
*/
function ModalHeader({ title, subtitle, onClose, actions, children }) {
  return (
    <div className={styles.header}>
      {/* Kiri: judul & subtitle */}
      <div className={styles.headerLeft}>
        {children ? children : (
          <>
            {title    && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </>
        )}
      </div>

      {/* Kanan: actions slot + tombol close */}
      <div className={styles.headerActions}>
        {/* Slot untuk komponen tambahan sebelum tombol close */}
        {actions}

        {/* Tombol close */}
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <IconClose />
          </button>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Modal.Body
   ════════════════════════════════════════════════════════════

   Props:
   - children → konten utama, otomatis scrollable jika panjang
*/
function ModalBody({ children }) {
  return (
    <div className={styles.body}>
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Modal.Footer
   ════════════════════════════════════════════════════════════

   Props:
   - align    → 'right' | 'left' | 'between' (default: 'right')
   - children → tombol atau konten footer
*/
function ModalFooter({ align = 'right', children }) {
  const footerClass = [
    styles.footer,
    align === 'left'    ? styles.footerLeft    : '',
    align === 'between' ? styles.footerBetween : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={footerClass}>
      {children}
    </div>
  )
}

/* ── Attach sub-komponen ───────────────────────────────────── */
Modal.Header = ModalHeader
Modal.Body   = ModalBody
Modal.Footer = ModalFooter

export default Modal
