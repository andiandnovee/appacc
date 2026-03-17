import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import styles from './Breadcrumb.module.css'

/**
 * Breadcrumb
 * - items → array of { label, to? }
 *   item terakhir otomatis jadi "current" (tidak ada link)
 *
 * Contoh:
 * items={[
 *   { label: 'Dashboard', to: '/' },
 *   { label: 'Users',     to: '/users' },
 *   { label: 'Edit User' },
 * ]}
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.breadcrumb}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className={styles.item}>
              {!isLast && item.to
                ? <Link to={item.to} className={styles.link}>{item.label}</Link>
                : <span className={isLast ? styles.current : styles.link}>{item.label}</span>
              }
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  <ChevronRight size={14} />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
