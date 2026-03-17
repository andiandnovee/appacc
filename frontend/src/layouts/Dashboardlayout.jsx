import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import styles from "./Dashboardlayout.module.css";

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        <Navbar />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
