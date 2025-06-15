import styles from "./DashboardCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DashboardCard({ title, flexDirection, icon, children }) {
  return (
    <div className={styles["dashboard-card"]}>
      <div className={styles["dashboard-card__title-container"]}>
        <h4>{title}</h4>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={styles["title-container__icon"]}
          />
        )}
      </div>
      <div
        className={`${styles["dashboard-card__content-container"]} ${flexDirection && styles[flexDirection]}`}
      >
        {children}
      </div>
    </div>
  );
}
