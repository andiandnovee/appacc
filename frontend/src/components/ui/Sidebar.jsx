import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./Sidebar.module.css";

/* ── Menu items — tambah item baru di sini saja ────────────── */
const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/admin/users", icon: Users, label: "Admin Users" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-collapse di layar kecil
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Expanded = tidak collapsed, ATAU sedang di-hover saat collapsed
  const isExpanded = !isCollapsed || isHovered;

  const sidebarClass = [
    styles.sidebar,
    isExpanded ? styles.expanded : styles.collapsed,
  ].join(" ");

  return (
    <aside
      className={sidebarClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        className={`${styles.header} ${!isExpanded ? styles.headerCollapsed : ""}`}
      >
        {isExpanded && <h1 className={styles.brand}>MyDashboard</h1>}

        <button
          className={styles.toggleBtn}
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                styles.navLink,
                !isExpanded ? styles.navLinkCollapsed : "",
                isActive ? styles.navLinkActive : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <span className={styles.icon}>
              <Icon size={18} />
            </span>
            <span
              className={`${styles.navLabel} ${isExpanded ? styles.navLabelVisible : styles.navLabelHidden}`}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
