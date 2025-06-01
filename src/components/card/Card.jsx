import styles from "./Card.module.css";

export function Card({
  profilePicture,
  clientName,
  lastActive,
  activeSince,
  id,
  workouts,
  compliance,
  program,
}) {
  return (
    <div key={id} className={styles.card}>
      <div className={styles["card__left-content"]}>
        <img src={profilePicture} alt={clientName} />
        <div>
          <p className={styles.title}>{clientName}</p>
          <span>{lastActive}</span>
          <span>{activeSince}</span>
        </div>
      </div>
      <div className={styles["card__middle-content"]}>
        <p className={styles.title}>Client info</p>
        <div>
          <span>Workouts: {workouts}</span>
          <span>Compliance: {compliance}</span>
          <span>Program: {program}</span>
        </div>
      </div>
      <div className={styles["card__right-content"]}>
        <a href="/">View</a>
      </div>
    </div>
  );
}
