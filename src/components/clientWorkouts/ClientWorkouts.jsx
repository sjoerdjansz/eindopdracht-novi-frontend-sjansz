import styles from "./ClientWorkouts.module.css";
import { Link, useOutletContext } from "react-router-dom";

export function ClientWorkouts() {
  const { profile, workoutTemplates } = useOutletContext();
  console.log(workoutTemplates);
  return (
    <div className={styles["client-workouts"]}>
      <h2>Assigned Workouts</h2>
      <ul className={styles["client-workouts__list"]}>
        {workoutTemplates.length > 0 ? (
          workoutTemplates.map((workouts) => {
            return (
              <li
                className={styles["client-workouts__list-item"]}
                key={workouts.id}
              >
                <p>{workouts.name}</p>
                <Link to={"/"}>View workout</Link>
              </li>
            );
          })
        ) : (
          <div>
            <p>
              No workouts to display.{" "}
              <Link
                to={"/workouts"}
              >{`Assign first workout to ${profile.firstName}`}</Link>
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}
