import styles from "./Layout.module.css";

// Components
import { TopNav } from "../components/navbar/topnav/TopNav.jsx";
import { SideNav } from "../components/navbar/sidenav/SideNav.jsx";

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <TopNav />
      <SideNav />
      <main>{children}</main>
    </div>
  );
}
