import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Button.module.css'

/* ════════════════════════════════════════════════════════════
   Button
   ════════════════════════════════════════════════════════════

   Props:
   - variant     → 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
                   (default: 'primary')
   - size        → 'sm' | 'md' | 'lg' (default: 'md')
   - fullWidth   → boolean (default: false)
   - loading     → boolean — tampilkan spinner (default: false)
   - disabled    → boolean (default: false)
   - iconLeft    → React node — icon sebelum teks
   - iconRight   → React node — icon setelah teks
   - as          → element atau komponen, default 'button'
                   contoh: as="a", as={Link} (React Router)
   - children    → teks / konten tombol
   - ...rest     → diteruskan ke element (href, to, onClick, type, dll)
*/
export function Button({
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  loading   = false,
  disabled  = false,
  iconLeft,
  iconRight,
  as: Tag   = 'button',
  children,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading

  const btnClass = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth  ? styles.fullWidth   : '',
    loading    ? styles.loading     : '',
    isDisabled ? styles.btnDisabled : '',
    !children  ? styles.iconOnly    : '',
    className,
  ].filter(Boolean).join(' ')

  // Kalau Tag = 'button', tambahkan type="button" supaya tidak submit form
  const tagProps = Tag === 'button'
    ? { type: 'button', disabled: isDisabled, ...rest }
    : { 'aria-disabled': isDisabled, ...rest }

  return (
    <Tag className={btnClass} {...tagProps}>

      {/* Loading state */}
      {loading && (
        <span className={styles.spinnerWrapper} aria-hidden="true">
          <span className={styles.spinner} />
          {children && <span>Memuat...</span>}
        </span>
      )}

      {/* Konten (disembunyikan saat loading agar lebar tetap terjaga) */}
      <span className={loading ? styles.loadingContent : undefined}>
        {iconLeft  && <span aria-hidden="true">{iconLeft}</span>}
        {children}
        {iconRight && <span aria-hidden="true">{iconRight}</span>}
      </span>

    </Tag>
  )
}

/* ════════════════════════════════════════════════════════════
   SplitButton
   ════════════════════════════════════════════════════════════

   Props:
   - label       → string — teks tombol utama (wajib)
   - onClick     → function — aksi tombol utama (wajib)
   - options     → array of { label, icon?, onClick, as?, href?, to? }
   - variant     → sama seperti Button (default: 'primary')
   - size        → sama seperti Button (default: 'md')
   - fullWidth   → boolean (default: false)
   - disabled    → boolean (default: false)
   - loading     → boolean (default: false)

   Contoh options:
   [
     { label: 'Simpan sebagai draft', onClick: () => saveDraft() },
     { label: 'Simpan & publish',     onClick: () => publish()   },
     { label: 'Lihat preview', as: Link, to: '/preview'          },
   ]
*/
export function SplitButton({
  label,
  onClick,
  options = [],
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  disabled  = false,
  loading   = false,
}) {
  const [open, setOpen]   = useState(false)
  const wrapperRef        = useRef(null)

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  // Variant ghost/outline pakai divider gelap
  const needDarkDivider = variant === 'ghost' || variant === 'outline'

  return (
    <div
      ref={wrapperRef}
      className={`${styles.splitWrapper} ${fullWidth ? styles.fullWidth : ''}`}
    >
      {/* Tombol utama */}
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        className={`${styles.splitMain} ${needDarkDivider ? styles.splitDividerDark : ''}`}
      >
        {label}
      </Button>

      {/* Chevron toggle */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={() => setOpen(v => !v)}
        className={styles.splitChevron}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Tampilkan opsi lain"
      >
        <ChevronDown
          size={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: `transform var(--duration-fast) var(--ease-default)`,
          }}
        />
      </Button>

      {/* Dropdown */}
      {open && options.length > 0 && (
        <div className={styles.splitDropdown} role="menu">
          {options.map((opt, i) => {
            const Tag = opt.as ?? 'button'
            const props = Tag === 'button'
              ? { type: 'button', onClick: () => { opt.onClick?.(); setOpen(false) } }
              : { href: opt.href, to: opt.to, onClick: () => setOpen(false) }

            return (
              <Tag
                key={i}
                className={styles.splitDropdownItem}
                role="menuitem"
                {...props}
              >
                {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                {opt.label}
              </Tag>
            )
          })}
        </div>
      )}

    </div>
  )
}

// Default export = Button, SplitButton via named export
export default Button
