import styles from './Card.module.css'

/* ════════════════════════════════════════════════════════════
   Card — komponen utama
   ════════════════════════════════════════════════════════════

   Props:
   - variant    → 'default' | 'flat' | 'raised' | 'outlined' (default: 'default')
   - padding    → 'none' | 'sm' | 'md' | 'lg' (default: 'none')
                  Padding ini berlaku kalau TIDAK pakai sub-komponen.
                  Kalau pakai Card.Header / Card.Body / Card.Footer,
                  padding diatur oleh masing-masing sub-komponen.
   - hoverable  → boolean — efek hover shadow (default: false)
   - fullWidth  → boolean (default: false)
   - onClick    → function
   - className  → class tambahan dari luar
   - children   → konten card
*/
function Card({
  variant = 'default',
  padding = 'none',
  hoverable = false,
  fullWidth = false,
  onClick,
  className = '',
  children,
}) {
  const cardClass = [
    styles.card,
    variant !== 'default' ? styles[variant] : '',
    padding !== 'none'    ? styles[`pad${capitalize(padding)}`] : '',
    hoverable  ? styles.hoverable  : '',
    fullWidth  ? styles.fullWidth  : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Card.Header
   ════════════════════════════════════════════════════════════

   Props:
   - title      → string — judul card
   - subtitle   → string — subjudul (opsional)
   - action     → React node — tombol / badge di kanan header
   - children   → konten bebas (override title/subtitle)
*/
function CardHeader({ title, subtitle, action, children }) {
  return (
    <div className={styles.header}>
      {children ? (
        children
      ) : (
        <div className={styles.headerTitle}>
          {title    && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {action && (
        <div className={styles.headerAction}>
          {action}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Card.Body
   ════════════════════════════════════════════════════════════

   Props:
   - children  → konten utama card
*/
function CardBody({ children }) {
  return (
    <div className={styles.body}>
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Card.Footer
   ════════════════════════════════════════════════════════════

   Props:
   - align    → 'right' | 'left' | 'between' (default: 'right')
   - children → tombol atau konten footer
*/
function CardFooter({ align = 'right', children }) {
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

/* ── Helper ────────────────────────────────────────────────── */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/* ── Attach sub-komponen ke Card ───────────────────────────── */
Card.Header = CardHeader
Card.Body   = CardBody
Card.Footer = CardFooter

export default Card