import { FC, ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import styles from "./Dashboardlayout.module.css";

const DashboardLayout: FC = (): ReactElement => {
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
};

export default DashboardLayout;
