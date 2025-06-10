import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";

// Components
import { TopNav } from "../components/navbar/topnav/TopNav.jsx";
import { SideNav } from "../components/navbar/sidenav/SideNav.jsx";

export function Layout() {
  return (
    <div className={styles.layout}>
      <TopNav />
      <SideNav />
      <main className={styles["page-content-container"]}>
        <Outlet />
      </main>
    </div>
  );
}
