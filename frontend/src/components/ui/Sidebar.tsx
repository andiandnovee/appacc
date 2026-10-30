import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
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
  BookOpen,
  History,
  Calculator,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { DollarSign, HatGlassesIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

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
      { to: "/invoice/f53-helper", icon: DollarSign, label: "F53 Helper" },
      { to: "/invoice/debet-nota", icon: FileSpreadsheet, label: "Jurnal Debet Nota", permission: "view gl accounts" },
    
    ],
  },
  {
    label: "Kendaraan",
    items: [
      { to: "/vehicles/logbook", icon: BookOpen, label: "Logbook & Biaya" },
      { to: "/vehicles/manage", icon: Car, label: "Master Kendaraan" },
      { to: "/vehicles/stnk-journal", icon: BookOpen, label: "STNK Journal" },
    ],
  },
  {
    label: "Database",
    items: [
      { to: "/ref/vendors", icon: Users, label: "Vendor" },
      { to: "/ref/busa", icon: MapPin, label: "Business Area" },
      { to: "/ref/stages", icon: Star, label: "Periode " },
      { to: "/ref/cost-centers", icon: DollarSign, label: "Cost Centers" },
      { to: "/ref/gl-accounts", icon: Calculator, label: "GL Accounts", permission: "view gl accounts" },
      { to: "/ref/customers", icon: Users, label: "Customers" },
    ],
  },
  // {
  //   label: "Tools & Utility",
  //   items: [
  //     {
  //       to: "/utility/import-po",
  //       icon: Upload,
  //       label: "Import PO (SAP)",
  //       badge: "operator",
  //     },
  //   ],
  // },
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
  const { user } = useAuth();
  const userRoles = Array.isArray(user?.roles) ? user.roles.map((role: string) => role.toLowerCase()) : [];
  const isSuperAdmin = userRoles.includes("super-admin");
  const navGroups = NAV_GROUPS.map((group) =>
    group.label === "Admin" && isSuperAdmin
      ? {
          ...group,
          items: [
            ...group.items,
            { to: "/admin/audit-activity", icon: History, label: "Audit Activity", badge: "admin" },
          ],
        }
      : group,
  ).map((group) => ({
    ...group,
    items: group.items.filter((item: any) =>
      !item.permission || user?.permission_names?.includes(item.permission) || user?.permissions?.includes(item.permission),
    ),
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => setIsCollapsed(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

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
        {navGroups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {group.label && (
              <div
                className={`${styles.groupHeader} ${!isExpanded ? styles.groupHeaderCollapsed : ""}`}
              >
                <span className={styles.groupLabel}>{group.label}</span>
              </div>
            )}

            {group.items.map(({ to, icon: Icon, label, end, badge }: any) => (
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
