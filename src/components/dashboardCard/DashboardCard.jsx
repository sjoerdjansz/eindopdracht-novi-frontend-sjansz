import styles from "./DashboardCard.module.css";

export function DashboardCard({ title, flexDirection, children }) {
  return (
    <div className={styles["dashboard-card"]}>
      <h3>{title}</h3>
      <div
        className={`${styles["dashboard-card__content-container"]} ${flexDirection && styles[flexDirection]}`}
      >
        {children}
      </div>
    </div>
  );
}
