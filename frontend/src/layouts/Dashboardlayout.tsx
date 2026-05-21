import { FC, ReactElement, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import styles from "./Dashboardlayout.module.css";

const DashboardLayout: FC = (): ReactElement => {
  const [isMobile, setIsMobile]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // reset saat resize ke desktop
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={styles.layout}>

      {/* Backdrop — mobile only, saat sidebar terbuka */}
      {isMobile && sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isMobile={isMobile}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className={styles.content}>
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;