import styles from "./Dashboard.module.css";

import { DashboardCard } from "../../components/dashboardCard/DashboardCard.jsx";

export function Dashboard() {
  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["card-one"]}>
        <DashboardCard title="Client adherence">
          <div className={styles["compliance-info"]}>
            <span>82%</span>
            <p>7 Day</p>
          </div>
          <div className={styles["compliance-info"]}>
            <span>75%</span>
            <p>30 Day</p>
          </div>
          <div className={styles["compliance-info"]}>
            <span>70%</span>
            <p>90 Day</p>
          </div>
        </DashboardCard>
      </div>

      <div className={styles["card-two"]}>
        <DashboardCard title="Workouts" flexDirection="direction-column">
          <div className={styles["workouts-info"]}>
            <p>
              Total workouts completed: <span>125</span>
            </p>
          </div>
          <div className={styles["workouts-info"]}>
            <p>
              Last 7 days: <span>12</span>
            </p>
          </div>
        </DashboardCard>
      </div>
      <div className={styles["card-three"]}>
        <DashboardCard title="Training volume" flexDirection="direction-column">
          <div>
            <p>
              Total training volume: <span>1.2 million kg</span>
            </p>
          </div>
          <div>
            <p>
              Last 7 days: <span>50.000 kg</span>
            </p>
          </div>
        </DashboardCard>
      </div>

      <div className={styles["main-content"]}>main content</div>
      <div className={styles["side-content"]}>side content</div>
    </div>
  );
}
