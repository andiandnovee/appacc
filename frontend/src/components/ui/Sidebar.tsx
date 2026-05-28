import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Percent,
  Car,
  Upload,
  Users,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_GROUPS = [
  {
    label: null,
    items: [{ to: "/", icon: LayoutDashboard, label: "Dashboard", end: true }],
  },
  {
    label: "Penerimaan Invoice",
    items: [
      { to: "/invoice/receipts", icon: FileText, label: "Monitor Invoice" },
      { to: "/invoice/pph", icon: Percent, label: "Rekap PPh" },
    ],
  },
  {
    label: "Database",
    items: [
      { to: "/ref/vendors", icon: Users, label: "Vendor" },
      { to: "/ref/busa", icon: MapPin, label: "Business Area" },
      { to: "/ref/stages", icon: Star, label: "Ref Stage" },
    ],
  },
  {
    label: "Tools & Utility",
    items: [
      { to: "/utility/kendaraan", icon: Car, label: "Kendaraan & STNK" },
      {
        to: "/utility/import-po",
        icon: Upload,
        label: "Import PO (SAP)",
        badge: "operator",
      },
      {
        to: "/utility/import-pph",
        icon: Upload,
        label: "Import PPh",
        badge: "operator",
      },
       {                                    // ✅ masuk sini
      to: "/utility/import-f53",
      icon: Upload,
      label: "Import F53",
      badge: "operator",
    },
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

export default function Sidebar({
  isMobile = false,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Desktop: auto-collapse saat layar medium
  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => setIsCollapsed(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Mobile: tutup sidebar saat navigasi
  const handleNavClick = () => {
    if (isMobile) onMobileClose?.();
  };

  const isExpanded = isMobile ? true : !isCollapsed || isHovered;

  return (
    <aside
      className={[
        styles.sidebar,
        isMobile
          ? mobileOpen
            ? styles.sidebarMobileOpen
            : ""
          : isExpanded
            ? styles.expanded
            : styles.collapsed,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false);
      }}
    >
      {/* Header */}
      <div
        className={`${styles.header} ${!isExpanded ? styles.headerCollapsed : ""}`}
      >
        {isExpanded && <h1 className={styles.brand}>APPACC</h1>}

        {/* Desktop: toggle collapse */}
        {!isMobile && (
          <button
            className={styles.toggleBtn}
            onClick={() => setIsCollapsed((v) => !v)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        )}

        {/* Mobile: tombol close (X) */}
        {isMobile && (
          <button
            className={styles.closeBtn}
            onClick={onMobileClose}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {group.label && (
              <div
                className={`${styles.groupHeader} ${!isExpanded ? styles.groupHeaderCollapsed : ""}`}
              >
                <span className={styles.groupLabel}>{group.label}</span>
              </div>
            )}

            {group.items.map(({ to, icon: Icon, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={handleNavClick}
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
