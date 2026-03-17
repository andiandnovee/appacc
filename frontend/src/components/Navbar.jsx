import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import ThemeToggle from "./Themetoggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // ── Tutup dropdown kalau klik di luar ──────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className={styles.navbar}>
      {/* Search */}
      <div className={styles.search}>
        <span className={styles.searchIcon}>
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Right section */}
      <div className={styles.right}>
        {/* Dark mode toggle */}
        <ThemeToggle />

        {/* Notification */}
        <button className={styles.iconBtn} aria-label="Notifikasi">
          <Bell size={20} />
          <span className={styles.badge} aria-label="3 notifikasi baru">
            3
          </span>
        </button>

        {/* Profile dropdown */}
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar Admin"
              className={styles.avatar}
            />
            <span className={styles.profileName}>Admin</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className={styles.dropdown} role="menu">
              <a
                href="/profile"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Profile
              </a>
              <a
                href="/settings"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Settings
              </a>
              <div className={styles.dropdownDivider} />
              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  // tambahkan logout logic di sini
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
