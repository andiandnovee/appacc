import { FC, ReactNode, ReactElement, useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./Themetoggle";
import styles from "./Navbar.module.css";

interface NavbarProps {
  // Props here
}


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  // Avatar fallback: inisial nama
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
        <ThemeToggle />

        <button className={styles.iconBtn} aria-label="Notifikasi">
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        {/* Profile dropdown */}
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            <span className={styles.profileName}>{user?.name ?? "..."}</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            />
          </button>

          {open && (
            <div className={styles.dropdown} role="menu">
              {/* Info user */}
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>{user?.name}</p>
                <p className={styles.dropdownEmail}>{user?.email}</p>
              </div>
              <div className={styles.dropdownDivider} />
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
                className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                role="menuitem"
                onClick={handleLogout}
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
