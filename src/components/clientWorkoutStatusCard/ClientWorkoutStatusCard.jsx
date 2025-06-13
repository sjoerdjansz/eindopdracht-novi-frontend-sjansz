import styles from "./ClientWorkoutStatusCard.module.css";

export function ClientWorkoutStatusCard({
  clientImage,
  clientName,
  workoutName,
  workoutFinished,
  adherenceInfo,
  adherence,
}) {
  return (
    <li className={styles["client-list__client-info"]}>
      <img src={clientImage} alt="Client Jimmy profile picture" />
      <div>
        <p className={styles["client-list__client-name"]}>{clientName}</p>
        <p className={styles["client-list__workout-info"]}>
          {workoutName ? (
            <>
              {workoutName} –{" "}
              {workoutFinished ? (
                <span className={styles["workout-info--done"]}>Done</span>
              ) : (
                <span className={styles["workout-info--pending"]}>Pending</span>
              )}
            </>
          ) : adherence ? (
            <>
              {adherenceInfo} –{" "}
              <span className={styles["workout-adherence--down"]}>
                {adherence}
              </span>
            </>
          ) : null}
        </p>
      </div>
    </li>
  );
}
