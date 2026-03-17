import { Inbox } from 'lucide-react'
import styles from './EmptyState.module.css'

/**
 * EmptyState
 *
 * Props:
 * - icon        → React node — override icon default
 * - title       → string
 * - description → string
 * - actions     → React node — tombol aksi (misal: <Button>Tambah Data</Button>)
 *
 * Contoh:
 * <EmptyState
 *   title="Belum ada pengguna"
 *   description="Mulai dengan menambahkan pengguna pertama."
 *   actions={<Button onClick={...}>Tambah Pengguna</Button>}
 * />
 */
export default function EmptyState({ icon, title, description, actions }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration} aria-hidden="true">
        {icon ?? <Inbox size={56} strokeWidth={1.2} />}
      </div>
      {title       && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {actions     && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
