import { NavLink, Outlet } from 'react-router-dom'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  return (
    <div className={styles.layout}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>

        <h2 className={styles.brand}>Admin Panel</h2>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            About
          </NavLink>
        </nav>

      </aside>

      {/* Content */}
      <main className={styles.main}>
        <Outlet />
      </main>

    </div>
  )
}