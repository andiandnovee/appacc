import { FC, ReactNode, ReactElement, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  BarChart2,
  Percent,
  Car,
  Upload,
  Users,
  MapPin,
  List,
  Database,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  // Props here
}

/* ── Struktur menu ─────────────────────────────────────────── */
/*
  Tiap grup punya:
    label  : judul grup (string)
    items  : array item

  Tiap item punya:
    to     : route path
    icon   : lucide component
    label  : teks menu
    end    : exact match (opsional)
    badge  : teks badge kecil (opsional) — e.g. "operator", "admin"
    roles  : array role yg boleh lihat (opsional, untuk filtering nanti)
*/
const NAV_GROUPS = [
  {
    label: null, // grup tanpa judul
    items: [{ to: "/", icon: LayoutDashboard, label: "Dashboard", end: true }],
  },
  {
    label: "Penerimaan Invoice",
    items: [
      { to: "/invoice/receipts", icon: FileText, label: "Monitor Invoice" },
      {
        to: "/invoice/input",
        icon: FilePlus,
        label: "Input Penerimaan",
        badge: "operator",
      },
      { to: "/invoice/rekap", icon: BarChart2, label: "Rekap & Export" },
      { to: "/invoice/pph", icon: Percent, label: "Rekap PPh" },
    ],
  },
  {
    label: "Utility",
    items: [
      { to: "/utility/kendaraan", icon: Car, label: "Kendaraan & STNK" },
      {
        to: "/utility/import-po",
        icon: Upload,
        label: "Import PO (SAP)",
        badge: "operator",
      },
    ],
  },
  {
    label: "Referensi",
    items: [
      { to: "/ref/vendors", icon: Users, label: "Vendor" },
      { to: "/ref/busa", icon: MapPin, label: "Business Area" },
      { to: "/ref/pph", icon: List, label: "Ref PPh" },
      { to: "/ref/po", icon: Database, label: "Ref PO" },
      { to: "/ref/stages", icon:Star, label: "Ref Stage" },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        to: "/admin/users",
        icon: ShieldCheck,
        label: "Users & Role",
        badge: "admin",
      },
    ],
  },
];

/* ── Komponen ──────────────────────────────────────────────── */
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpanded = !isCollapsed || isHovered;

  return (
    <aside
      className={[
        styles.sidebar,
        isExpanded ? styles.expanded : styles.collapsed,
      ].join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        className={`${styles.header} ${!isExpanded ? styles.headerCollapsed : ""}`}
      >
        {isExpanded && <h1 className={styles.brand}>APPACC</h1>}
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
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {/* Divider + label grup */}
            {group.label && (
              <div
                className={`${styles.groupHeader} ${!isExpanded ? styles.groupHeaderCollapsed : ""}`}
              >
                <span className={styles.groupLabel}>{group.label}</span>
              </div>
            )}

            {/* Items */}
            {group.items.map(({ to, icon: Icon, label, end, badge }) => (
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

                {/* Label + badge — hanya saat expanded */}
                <span
                  className={`${styles.navLabel} ${isExpanded ? styles.navLabelVisible : styles.navLabelHidden}`}
                >
                  {label}
                </span>
                {badge && isExpanded && (
                  <span
                    className={`${styles.badge} ${styles[`badge_${badge}`] ?? styles.badge_default}`}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
